/**
 * Velness — AI Runtime: Context Builder
 *
 * The ONLY place that assembles the augmented prompt context. Merges:
 *  - Memory / profile / journey (from MemoryTool)
 *  - Live tool results (Knowledge / News / Weather / Medical)
 *  - RAG chunks (Phase 4 stub — empty today)
 * into a single "## Live Context" block the orchestrator injects after the
 * system persona. Providers never build prompts; only this does.
 */

import type { MemoryContext, ToolResult } from './types';
import type { ContextChunk } from './rag/RetrievalTool';
import { CitationService } from './citations/CitationService';

export class ContextBuilder {
  constructor(private citationService = new CitationService()) {}

  /** Build the injected context block from tool results. */
  buildContextBlock(results: ToolResult[], ragChunks: ContextChunk[] = []): string {
    const sections: string[] = [];

    const memory = results.find((r) => r.capability === 'MEMORY' && r.success);
    if (memory && memory.payload) {
      sections.push(memory.payload);
    }

    const live = results.filter(
      (r) => r.success && r.capability !== 'MEMORY' && r.payload,
    );
    if (live.length > 0) {
      const body = live
        .map((r) => `### ${r.capability}\n${r.payload}`)
        .join('\n\n');
      sections.push(`LIVE INFORMATION (verified, with sources):\n${body}`);
    }

    if (ragChunks.length > 0) {
      const body = ragChunks.map((c) => c.content).join('\n\n');
      sections.push(`INTERNAL KNOWLEDGE:\n${body}`);
    }

    if (sections.length === 0) return '';
    return `## Live Context\n${sections.join('\n\n')}`;
  }

  /** Final deduplicated citations for the terminal chunk. */
  citations(results: ToolResult[]) {
    return this.citationService.collect(results);
  }
}
