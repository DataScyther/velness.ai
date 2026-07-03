/**
 * AI Service — Main Entry Point
 *
 * Provides a provider-agnostic interface for AI interactions.
 * The active provider can be swapped without changing application code.
 */

import type { AIProvider, AIResponse, AIStreamParams, AICompleteParams, AIMessage, StreamChunk } from './types';
import { AIError } from './types';
import { NvidiaProvider } from './providers/NvidiaProvider';

export { AIError };

let activeProvider: AIProvider | null = null;

function getProvider(): AIProvider {
  if (!activeProvider) {
    activeProvider = new NvidiaProvider();
  }
  return activeProvider;
}

/**
 * Set a custom AI provider (useful for testing or switching providers).
 */
export function setProvider(provider: AIProvider): void {
  activeProvider = provider;
}

/**
 * Get the current AI provider name.
 */
export function getProviderName(): string {
  return getProvider().name;
}

/**
 * Stream a chat response from the AI provider.
 */
export async function* streamChat(params: AIStreamParams): AsyncGenerator<StreamChunk> {
  yield* getProvider().streamChat(params);
}

/**
 * Generate a complete (non-streaming) response.
 */
export async function generateResponse(params: AICompleteParams): Promise<AIResponse> {
  return getProvider().generateResponse(params);
}

/**
 * Convert an array of AIMessages to the text + history format.
 */
export function messagesToParams(
  messages: AIMessage[],
  uid: string,
  signal?: AbortSignal
): AIStreamParams {
  const last = messages[messages.length - 1];
  const text = last?.content ?? '';
  const history = messages
    .slice(0, -1)
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      m.role === 'user' || m.role === 'assistant'
    )
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  return { text, uid, history, signal };
}
