/**
 * Velness — AI Runtime: Knowledge Tool (capability KNOWLEDGE)
 *
 * Primary: Wikipedia (free). Falls back to Exa, then Tavily when configured.
 * Returns structured ToolResult only — never builds prompts.
 */

import type { Tool, ToolInput } from './Tool';
import { Capability, type ToolResult } from '../types';
import type { CacheManager } from '../cache/CacheManager';
import { WikipediaProvider, toCitation as wikiCite } from './providers/WikipediaProvider';
import { ExaProvider, toCitation as exaCite } from './providers/ExaProvider';
import { TavilyProvider, toCitation as tavilyCite } from './providers/TavilyProvider';

export class KnowledgeTool implements Tool {
  readonly capability = Capability.KNOWLEDGE;
  readonly name = 'KnowledgeTool';

  constructor(
    private cache: CacheManager,
    private wikipedia = new WikipediaProvider(),
    private exa = new ExaProvider(),
    private tavily = new TavilyProvider(),
  ) {}

  async run(input: ToolInput): Promise<ToolResult> {
    const query = input.query;
    const cached = this.cache.get<ToolResult>(this.capability, query);
    if (cached) return cached;

    const citations = [];
    let payload = '';

    // Tier 1: Wikipedia (free)
    const wiki = await this.wikipedia.search(query);
    for (const r of wiki) {
      citations.push(wikiCite(r));
      payload += `\n\n${r.title}\n${r.content}`;
    }

    // Tier 2: Exa (premium, optional)
    if (payload.length < 200 && this.exa.isConfigured()) {
      const exa = await this.exa.search(query);
      for (const r of exa) {
        citations.push(exaCite(r));
        payload += `\n\n${r.title}\n${r.content}`;
      }
    }

    // Tier 3: Tavily (premium fallback, optional)
    if (payload.length < 200 && this.tavily.isConfigured()) {
      const tav = await this.tavily.search(query);
      for (const r of tav) {
        citations.push(tavilyCite(r));
        payload += `\n\n${r.title}\n${r.content}`;
      }
    }

    const result: ToolResult = {
      capability: this.capability,
      success: citations.length > 0,
      confidence: citations.length ? Math.max(...citations.map((c) => c.confidence)) : 0,
      timestamp: new Date().toISOString(),
      sources: citations,
      payload: payload.trim(),
    };
    this.cache.set(this.capability, query, result);
    return result;
  }
}
