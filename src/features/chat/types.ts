/**
 * Chat Feature — Shared Type Definitions
 *
 * These types are used across all chat components and the useChatStream hook.
 * Keep this file lean — no business logic.
 */

export type MessageRole = 'user' | 'assistant';

/**
 * Lifecycle of a message:
 *   'sending'   → user tapped send, optimistic insert before API call
 *   'streaming' → assistant message receiving tokens
 *   'done'      → message complete (user or assistant)
 *   'error'     → streaming failed, retry available
 */
export type MessageStatus = 'sending' | 'streaming' | 'done' | 'error';

export interface ChatMessage {
  /** Stable UUID — used as FlatList key */
  id: string;
  role: MessageRole;
  /** Accumulated content. For streaming messages this grows token-by-token. */
  content: string;
  /** Human-readable time string, e.g. "3:45 PM" */
  timestamp: string;
  status: MessageStatus;
  /** Set when status === 'error'. Human-friendly message. */
  errorMessage?: string;
}

export type ChatViewState = 'loading' | 'empty' | 'conversation' | 'error';

export interface ChatStreamState {
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  retryLast: () => Promise<void>;
  clearError: (id: string) => void;
  clearConversation: () => void;
}
