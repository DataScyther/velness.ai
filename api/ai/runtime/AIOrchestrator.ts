/**
 * Velness — AI Runtime: Orchestrator (single execution entry point)
 *
 * Every AI request flows through here:
 *   request → IntentClassifier → ToolRouter → ContextBuilder → ModelGateway → stream
 *
 * Responsibilities:
 *  - classify intent (Nemotron-driven, heuristic fallback)
 *  - run selected capability tools (parallel, cache-aware)
 *  - assemble unified context + citations
 *  - stream Nemotron's response (unchanged {id, contentDelta, done} wire shape)
 *  - emit a terminal chunk carrying deduplicated citations
 *  - emit an observability trace
 *
 * No business logic lives outside this layer (or its injected collaborators).
 */

import {
  Capability,
  type AIRequest,
  type StreamChunk,
  type Intent,
  type RequestTrace,
  type ChatHistoryMessage,
  type MemoryContext,
  type ModelGatewayLike,
} from './types';
import { ModelGateway } from './ModelGateway';
import { buildSystemPrompt } from './PromptAssembler';
import { IntentClassifier, buildClassifierMessages } from './IntentClassifier';
import { ToolRouter } from './ToolRouter';
import { ToolRegistry } from './tools/Tool';
import { ContextBuilder } from './ContextBuilder';
import { CacheManager } from './cache/CacheManager';
import { getFeatureFlags, Timer, logTrace } from './config';

export interface OrchestratorDeps {
  registry: ToolRegistry;
  cache?: CacheManager;
  gateway?: ModelGatewayLike;
}

export class AIOrchestrator {
  private gateway: ModelGatewayLike;
  private cache: CacheManager;
  private classifier: IntentClassifier;
  private router: ToolRouter;
  private contextBuilder: ContextBuilder;

  constructor(deps: OrchestratorDeps) {
    this.gateway = deps.gateway ?? new ModelGateway();
    this.cache = deps.cache ?? new CacheManager();
    this.contextBuilder = new ContextBuilder();
    const flags = getFeatureFlags();
    this.router = new ToolRouter(deps.registry, flags);
    this.classifier = new IntentClassifier({
      classifyViaModel: (text, history) => this.classifyViaModel(text, history),
    });
  }

  /** Cheap, non-streaming classification call to Nemotron. */
  private async classifyViaModel(
    text: string,
    history: ChatHistoryMessage[],
  ): Promise<Intent | null> {
    try {
      const messages = buildClassifierMessages(text);
      // Reuse gateway streaming but accumulate a short JSON response.
      let json = '';
      for await (const chunk of this.gateway.streamCompletion(messages, 'standard')) {
        json += chunk.contentDelta;
        if (json.length > 600) break;
      }
      const parsed = JSON.parse(json.replace(/^[\s\S]*?\{/, '{').replace(/\}[^}]*$/, '}'));
      const caps: Capability[] = Array.isArray(parsed.capabilities)
        ? parsed.capabilities.filter((c: string) => Object.values(Capability).includes(c as Capability))
        : [];
      if (caps.length === 0) return null;
      return {
        capabilities: caps,
        needsSearch: Boolean(parsed.needsSearch),
        raw: parsed,
      };
    } catch {
      return null;
    }
  }

  async *handle(req: AIRequest): AsyncGenerator<StreamChunk> {
    const requestId = req.requestId && typeof req.requestId === 'string' && req.requestId.trim().length > 0
      ? req.requestId.trim()
      : crypto.randomUUID();
    const flags = getFeatureFlags();
    const intentTimer = new Timer();
    const totalTimer = new Timer();

    const intent = await this.classifier.classify(req.text, req.history ?? [], req.memoryContext);
    const intentMs = intentTimer.stop();

    // Run tools (parallel). Cache hits/misses recorded inside CacheManager.
    const providerTimer = new Timer();
    const results = await this.router.run(
      intent,
      {
        query: req.text,
        memoryContext: req.memoryContext,
        uid: req.uid,
        location: (req.memoryContext as MemoryContext & { location?: { lat: number; lon: number } })?.location,
      },
    );
    const providerMs = providerTimer.stop();

    const citations = flags.ENABLE_CITATIONS
      ? this.contextBuilder.citations(results)
      : [];
    const contextBlock = this.contextBuilder.buildContextBlock(results);

    const system = buildSystemPrompt(req.memoryContext);
    const augmentedSystem = contextBlock
      ? `${system}\n\n${contextBlock}`
      : system;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: augmentedSystem },
      ...(req.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: req.text },
    ];

    const llmTimer = new Timer();
    let firstChunk = true;
    const toolsUsed = results.map((r) => r.capability);
    for await (const chunk of this.gateway.streamCompletion(messages, req.mode ?? 'standard')) {
      if (firstChunk) {
        firstChunk = false;
        llmTimer.stop(); // measured from first token
        // Echo correlation + observability fields on the first streamed chunk
        // so a client can deterministically map its request to the server's
        // [ai-trace] and to the provider-selection decision (plan §1.2/§1.6).
        yield {
          ...chunk,
          requestId,
          capabilities: intent.capabilities,
          toolsUsed,
        };
        continue;
      }
      yield chunk;
    }

    // Terminal chunk carries citations (no extra content).
    yield {
      id: crypto.randomUUID(),
      contentDelta: '',
      done: true,
      citations: citations.length ? citations : undefined,
    };

    const trace: RequestTrace = {
      requestId,
      intentMs,
      capabilities: intent.capabilities,
      toolsUsed: results.map((r) => r.capability),
      cacheHits: this.cache.hits,
      cacheMisses: this.cache.misses,
      providerMs,
      llmMs: llmTimer.stop(),
      totalMs: totalTimer.stop(),
    };
    logTrace(trace);
  }
}
