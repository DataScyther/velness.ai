/**
 * Velness — RAG Ingestion Script (Phase 4.1)
 *
 * Standalone Node script (run via `tsx`, which handles the runtime's TS).
 * Reads server env (.env) and pushes source documents into the Pinecone index
 * via the runtime's IngestionPipeline.
 *
 * Source docs live in scripts/rag-corpus/*.txt (one file = one document; the
 * filename stem becomes the doc id). Add your CBT guides, meditation scripts,
 * journey lessons, clinical references there, then run this.
 *
 * Usage:
 *   npm run rag:ingest                             # ingest everything
 *   DOCS=doc1,doc2 npm run rag:ingest             # ingest a subset
 *
 * Requires (server-only, in .env):
 *   PINECONE_API_KEY, PINECONE_INDEX, PINECONE_CLOUD, PINECONE_REGION,
 *   NVIDIA_API_KEY, VITE_NVIDIA_BASE_URL, [NVIDIA_EMBED_MODEL]
 *
 * Auto-creates the index on first run if missing. RAG answers only contain
 * internal knowledge after vectors exist here.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Minimal .env loader (no extra dependency).
const __dirname = dirname(fileURLToPath(import.meta.url));
function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const CORPUS_DIR = resolve(__dirname, 'rag-corpus');

const { PineconeVectorStore } = await import('../api/ai/runtime/rag/vectorStore/PineconeVectorStore.ts');
const { IngestionPipeline } = await import('../api/ai/runtime/rag/ingestion/IngestionPipeline.ts');
const { EmbeddingService } = await import('../api/ai/runtime/rag/ingestion/EmbeddingService.ts');

async function main() {
  const store = new PineconeVectorStore();
  const embeddings = new EmbeddingService();
  if (!store.isConfigured() || !embeddings.isConfigured()) {
    console.error('[rag-ingest] Missing config. Need PINECONE_API_KEY + NVIDIA_API_KEY + VITE_NVIDIA_BASE_URL in .env');
    process.exit(2);
  }

  await store.ensureReady();

  if (!existsSync(CORPUS_DIR)) {
    console.error(`[rag-ingest] No corpus dir at ${CORPUS_DIR}. Add .txt files there.`);
    process.exit(1);
  }

  const only = process.env.DOCS ? new Set(process.env.DOCS.split(',').map((s) => s.trim())) : null;
  const files = readdirSync(CORPUS_DIR).filter((f) => f.endsWith('.txt'));
  if (files.length === 0) {
    console.error('[rag-ingest] No .txt files in corpus dir.');
    process.exit(1);
  }

  const pipe = new IngestionPipeline(store, embeddings);
  let total = 0;
  for (const file of files) {
    const id = file.replace(/\.txt$/, '');
    if (only && !only.has(id)) continue;
    const text = readFileSync(join(CORPUS_DIR, file), 'utf-8');
    const n = await pipe.ingest({ id, text, source: 'internal' });
    total += n;
    console.log(`[rag-ingest] ${id}: ${n} chunks upserted`);
  }
  console.log(`[rag-ingest] done. total chunks: ${total}`);
}

main().catch((e) => {
  console.error('[rag-ingest] failed:', e);
  process.exit(1);
});
