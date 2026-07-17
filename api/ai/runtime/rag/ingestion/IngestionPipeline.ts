/**
 * Velness — AI Runtime: Ingestion Pipeline (Phase 4.1)
 *
 * Turns source documents (CBT guides, meditation scripts, journey lessons,
 * clinical references) into embedded vectors stored in a VectorStore. Pure
 * orchestration of chunk → embed → upsert; no provider knowledge leaks here.
 * Degrades to a no-op when embeddings/store are unconfigured.
 */

import type { VectorStore, VectorRecord } from '../vectorStore/VectorStore';
import { EmbeddingService } from './EmbeddingService';

export interface IngestDocument {
  id: string;
  text: string;
  source: string;
  /** Opaque extra metadata (e.g. category, locale). */
  extra?: Record<string, string | number | boolean>;
}

export interface IngestionPipelineOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  namespace?: string;
}

export class IngestionPipeline {
  constructor(
    private store: VectorStore,
    private embeddings: EmbeddingService,
    private opts: IngestionPipelineOptions = {},
  ) {}

  /** Split text into overlapping chunks (~chunkSize chars). */
  chunk(text: string, chunkSize = this.opts.chunkSize ?? 800, overlap = this.opts.chunkOverlap ?? 120): string[] {
    const clean = text.trim();
    if (clean.length <= chunkSize) return clean ? [clean] : [];
    const out: string[] = [];
    let start = 0;
    while (start < clean.length) {
      out.push(clean.slice(start, start + chunkSize));
      start += chunkSize - overlap;
    }
    return out;
  }

  async ingest(doc: IngestDocument): Promise<number> {
    if (!this.embeddings.isConfigured()) return 0;
    const chunks = this.chunk(doc.text);
    if (chunks.length === 0) return 0;
    const vectors = await this.embeddings.embedBatch(chunks, { inputType: 'passage' });
    const records: VectorRecord[] = [];
    chunks.forEach((chunk, i) => {
      const vec = vectors[i];
      if (!vec) return;
      records.push({
        id: `${doc.id}#${i}`,
        values: vec,
        metadata: {
          text: chunk,
          source: doc.source,
          docId: doc.id,
          chunk: i,
          ...(doc.extra ?? {}),
        },
      });
    });
    if (records.length > 0) await this.store.upsert(records);
    return records.length;
  }
}
