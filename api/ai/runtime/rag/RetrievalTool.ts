/**
 * Velness — AI Runtime: RAG Retrieval interface (Phase 4 stub)
 *
 * Defines the contract for internal knowledge retrieval (CBT guides,
 * meditation, journal/mood logs, journey lessons, clinical references).
 * Implementation is deferred until the backend freeze lifts (pgvector +
 * embeddings + Supabase RPC). NotImplementedRetrievalTool returns [] so the
 * orchestrator compiles and runs today with zero schema changes.
 */

import { Capability, type Citation } from '../types';

export interface ContextChunk {
  content: string;
  source: string;
  confidence: number;
  citation?: Citation;
}

export interface RetrievalTool {
  readonly capability: Capability;
  retrieve(query: string): Promise<ContextChunk[]>;
}

export class NotImplementedRetrievalTool implements RetrievalTool {
  readonly capability = Capability.RAG;
  async retrieve(_query: string): Promise<ContextChunk[]> {
    return [];
  }
}
