/**
 * Velness — AI Runtime: Model Gateway
 *
 * Single boundary to the NVIDIA Nemotron chat-completions API. Uses the
 * SERVER-ONLY NVIDIA_API_KEY (never shipped to the client). Mirrors the
 * request shape previously built in src/services/ai/providers/payload.ts.
 */

import type { ChatMode, Role, StreamChunk } from './types';

interface GatewayMessage {
  role: Role;
  content: string;
}

function buildNvidiaPayload({
  model,
  messages,
  stream,
  mode = 'standard',
}: {
  model: string;
  messages: GatewayMessage[];
  stream: boolean;
  mode?: ChatMode;
}): string {
  const isDeep = mode === 'deep';
  return JSON.stringify({
    model,
    messages,
    temperature: isDeep ? 0.5 : 0.6,
    top_p: 0.95,
    // Standard mode is a concise wellness chat; cap tokens so tail latency
    // stays bounded. Deep mode keeps the larger budget for long-form output.
    max_tokens: isDeep ? 16384 : 1200,
    reasoning_budget: isDeep ? 16384 : 1200,
    chat_template_kwargs: { enable_thinking: true },
    stream,
  });
}

/**
 * Parse an NVIDIA SSE stream into StreamChunks. The edge function re-emits
 * these as newline-delimited JSON downstream.
 */
async function* parseNvidiaSse(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<StreamChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const withoutPrefix = trimmed.startsWith('data:')
          ? trimmed.slice(5).trim()
          : trimmed;
        if (!withoutPrefix || withoutPrefix === '[DONE]') continue;
        try {
          const parsed = JSON.parse(withoutPrefix);
          const delta =
            (typeof parsed?.choices?.[0]?.delta?.content === 'string' &&
              parsed.choices[0].delta.content) ||
            (typeof parsed?.choices?.[0]?.text === 'string' &&
              parsed.choices[0].text) ||
            (typeof parsed?.content === 'string' && parsed.content);
          if (typeof delta === 'string' && delta.length > 0) {
            yield { id: crypto.randomUUID(), contentDelta: delta };
          }
          if (
            parsed?.choices?.[0]?.finish_reason === 'stop' ||
            parsed?.done === true
          ) {
            return;
          }
        } catch {
          // Not JSON; ignore malformed keep-alive frames.
        }
      }
    }
  }
  yield { id: crypto.randomUUID(), contentDelta: '', done: true };
}

export class ModelGateway {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY ?? '';
    this.model = process.env.VITE_NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';
    this.baseUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
    if (!this.apiKey) {
      throw new Error('NVIDIA_API_KEY is not configured on the server.');
    }
  }

  async *streamCompletion(
    messages: GatewayMessage[],
    mode: ChatMode = 'standard',
  ): AsyncGenerator<StreamChunk> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: buildNvidiaPayload({ model: this.model, messages, stream: true, mode }),
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => '');
      throw new Error(`NVIDIA request failed (${res.status}): ${errText}`);
    }

    yield* parseNvidiaSse(res.body as ReadableStream<Uint8Array>);
  }
}
