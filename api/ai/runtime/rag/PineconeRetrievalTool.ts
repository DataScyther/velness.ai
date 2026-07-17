/**
 * Velness — AI Runtime: Pinecone-backed Retrieval Tool (Phase 4.1)
 *
 * Implements the RetrievalTool contract using a VectorStore (Pinecone) plus an
 * EmbeddingService (NVIDIA). The rest of the runtime only knows
 * `RetrievalTool.retrieve(query): Promise<ContextChunk[]>` — it never sees
 * Pinecone. Swapping vector backends later means writing a new VectorStore.
 *
 * Returns [] when RAG is unconfigured (no key / flag off) so the orchestrator
 * stays stable and ContextBuilder simply omits the INTERNAL KNOWLEDGE block.
 */

import { Capability } from '../types';
import type { ContextChunk, RetrievalTool } from './RetrievalTool';
import type { VectorStore } from './vectorStore/VectorStore';
import { toContextChunks } from './vectorStore/VectorStore';
import { EmbeddingService } from './ingestion/EmbeddingService';

export class PineconeRetrievalTool implements RetrievalTool {
  readonly capability = Capability.RAG;
  readonly name = 'PineconeRetrievalTool';

  constructor(
    private store: VectorStore,
    private embeddings: EmbeddingService,
    private topK = 5,
  ) {}

  isConfigured(): boolean {
    return this.store.isConfigured();
  }

  async retrieve(query: string): Promise<ContextChunk[]> {
    if (!this.isConfigured() || !this.embeddings.isConfigured()) return [];
    const vector = await this.embeddings.embed(query, { inputType: 'query' });
    if (!vector) return [];
    const results = await this.store.query(vector, this.topK);
    return toContextChunks(results);
  }
}
