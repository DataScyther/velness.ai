/**
 * Velness — AI Runtime: Core Types
 *
 * Shared contracts for the server-side AI orchestration layer.
 * The edge function (api/ai/chat.ts) is a thin entrypoint that delegates
 * to AIOrchestrator. All business logic lives in api/ai/runtime.
 *
 * Wire contract note: the streamed response uses the SAME shape the client
 * already expects — { id, contentDelta, done? }. A terminal chunk carries
 * `citations` so the UI can render sources without parsing prose.
 */

export type Role = 'user' | 'assistant' | 'system';

export type ChatMode = 'standard' | 'deep';

/** Capabilities the orchestrator can ask for. The router maps these to tools. */
export enum Capability {
  GENERAL = 'GENERAL',
  KNOWLEDGE = 'KNOWLEDGE',
  NEWS = 'NEWS',
  WEATHER = 'WEATHER',
  MEDICAL = 'MEDICAL',
  MEMORY = 'MEMORY',
  PROFILE = 'PROFILE',
  JOURNEY = 'JOURNEY',
  RAG = 'RAG',
  EMERGENCY = 'EMERGENCY',
}

/** User-state context forwarded from the client (mirrors src/services/memory/types AIContext). */
export interface MemoryContext {
  userName?: string;
  preferredTone?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  returningUser?: boolean;
  previousMood?: string;
  summary?: string;
  goals?: string[];
  reflectionStreak?: number;
  currentJourney?: string;
  preferences?: string[];
  recentTopics?: string[];
  sessionCount?: number;
}

export interface ChatHistoryMessage {
  role: Exclude<Role, 'system'>;
  content: string;
}

export interface AIRequest {
  text: string;
  conversationId?: string;
  sessionId?: string;
  uid: string;
  history?: ChatHistoryMessage[];
  mode?: ChatMode;
  memoryContext?: MemoryContext;
}

/** A single sourced citation attached to retrieved content. */
export interface Citation {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  snippet?: string;
  confidence: number;
}

/**
 * Standardized tool output envelope. Every capability returns this exact
 * shape so the orchestrator and ContextBuilder stay provider-agnostic.
 */
export interface ToolResult {
  capability: Capability;
  success: boolean;
  confidence: number;
  timestamp: string;
  sources: Citation[];
  payload: string;
  error?: string;
}

/** Structured intent produced by IntentClassifier. */
export interface Intent {
  capabilities: Capability[];
  needsSearch: boolean;
  raw?: unknown;
}

/** Streaming chunk emitted to the client (unchanged wire contract). */
export interface StreamChunk {
  id: string;
  contentDelta: string;
  done?: boolean;
  citations?: Citation[];
}

/** Feature flags — gate capabilities independently without code changes. */
export interface FeatureFlags {
  ENABLE_KNOWLEDGE: boolean;
  ENABLE_NEWS: boolean;
  ENABLE_WEATHER: boolean;
  ENABLE_MEDICAL: boolean;
  ENABLE_MEMORY: boolean;
  ENABLE_CITATIONS: boolean;
  ENABLE_RAG: boolean;
}

/** Observability trace emitted per request. */
export interface RequestTrace {
  requestId: string;
  intentMs: number;
  capabilities: Capability[];
  toolsUsed: Capability[];
  cacheHits: Capability[];
  cacheMisses: Capability[];
  providerMs: number;
  llmMs: number;
  totalMs: number;
}
