/**
 * Velness — AI Runtime: Bootstrap
 *
 * Dependency injection point. Registers capability → tool mappings into the
 * ToolRegistry. Adding Exa/Tavily/PubMed/WHO later is a register() call here,
 * not a change to the orchestrator or router.
 */

import { ToolRegistry } from './tools/Tool';
import { CacheManager } from './cache/CacheManager';
import { KnowledgeTool } from './tools/KnowledgeTool';
import { NewsTool } from './tools/NewsTool';
import { WeatherTool } from './tools/WeatherTool';
import { MedicalTool } from './tools/MedicalTool';
import { MemoryTool } from './tools/MemoryTool';
import { AIOrchestrator } from './AIOrchestrator';
import { Capability } from './types';
import { getFeatureFlags } from './config';
import { PineconeVectorStore } from './rag/vectorStore/PineconeVectorStore';
import { PineconeRetrievalTool } from './rag/PineconeRetrievalTool';
import { EmbeddingService } from './rag/ingestion/EmbeddingService';

export function createOrchestrator(): AIOrchestrator {
  const cache = new CacheManager();
  const registry = new ToolRegistry();
  const memory = new MemoryTool(cache);

  registry.register(new KnowledgeTool(cache));
  registry.register(new NewsTool(cache));
  registry.register(new WeatherTool(cache));
  registry.register(new MedicalTool(cache));
  registry.register(memory); // MEMORY
  registry.register(memory, Capability.PROFILE);
  registry.register(memory, Capability.JOURNEY);

  // Phase 4.1: RAG retrieval (Pinecone). OFF by default (ENABLE_RAG=false) until
  // ingestion + retrieval quality are validated. When on, the retrieval tool is
  // the only addition — orchestrator/router/ContextBuilder are unchanged.
  const flags = getFeatureFlags();
  let retrievalTool;
  if (flags.ENABLE_RAG) {
    const store = new PineconeVectorStore();
    const embeddings = new EmbeddingService();
    if (store.isConfigured() && embeddings.isConfigured()) {
      retrievalTool = new PineconeRetrievalTool(store, embeddings);
    }
  }

  return new AIOrchestrator({ registry, cache, retrievalTool });
}
