/**
 * Velness — AI Runtime: Wikipedia Provider (free, no key)
 *
 * Returns a structured extract + summary. No prompt construction here.
 */

import type { Citation } from '../../types';

export interface SearchResult {
  title: string;
  content: string;
  url: string;
  publishedAt?: string;
  snippet?: string;
  confidence: number;
  source: string;
}

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export class WikipediaProvider {
  readonly name = 'Wikipedia';

  async search(query: string): Promise<SearchResult[]> {
    const normalized = query.trim();
    if (!normalized) return [];

    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts|info',
      exintro: '1',
      explaintext: '1',
      exsentences: '5',
      inprop: 'url',
      redirects: '1',
      titles: normalized,
      origin: '*',
    });

    const res = await fetch(`${WIKI_API}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    if (!data?.query?.pages) return [];

    const out: SearchResult[] = [];
    for (const page of Object.values<any>(data.query.pages)) {
      const extract: string = page.extract ?? '';
      if (!extract) continue;
      out.push({
        title: page.title ?? normalized,
        content: extract,
        url: page.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title ?? normalized)}`,
        snippet: extract.slice(0, 240),
        confidence: 0.9,
        source: this.name,
      });
    }
    return out;
  }
}

export function toCitation(r: SearchResult): Citation {
  return {
    title: r.title,
    url: r.url,
    source: r.source,
    publishedAt: r.publishedAt,
    snippet: r.snippet,
    confidence: r.confidence,
  };
}
