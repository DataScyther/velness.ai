/**
 * AI Service — Type Definitions
 */

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface AIResponse {
  content: string;
  reasoning?: string;
}

export interface StreamChunk {
  id: string;
  contentDelta: string;
  done?: boolean;
}

export interface AIStreamParams {
  text: string;
  uid: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  signal?: AbortSignal;
  memoryContext?: {
    userName?: string;
    preferredTone?: string;
    timeOfDay?: string;
    returningUser?: boolean;
    previousMood?: string;
    summary?: string;
    goals?: string[];
  };
}

export interface AICompleteParams {
  text: string;
  uid: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  signal?: AbortSignal;
  memoryContext?: {
    userName?: string;
    preferredTone?: string;
    timeOfDay?: string;
    returningUser?: boolean;
    previousMood?: string;
    summary?: string;
    goals?: string[];
  };
}

export interface AIProvider {
  /** Unique provider identifier */
  name: string;
  /** Stream a chat response */
  streamChat(params: AIStreamParams): AsyncGenerator<StreamChunk>;
  /** Generate a complete response */
  generateResponse(params: AICompleteParams): Promise<AIResponse>;
}

export class AIError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'AIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
