/**
 * Velness — AI Runtime: Weather Tool (capability WEATHER)
 *
 * Open-Meteo (free) — current weather + air quality. Coordinates come from
 * ToolInput.location (forwarded by the client from device/profile later).
 */

import type { Tool, ToolInput } from './Tool';
import { Capability, type ToolResult } from '../types';
import type { CacheManager } from '../cache/CacheManager';
import { OpenMeteoProvider, toCitation as wxCite } from './providers/OpenMeteoProvider';

export class WeatherTool implements Tool {
  readonly capability = Capability.WEATHER;
  readonly name = 'WeatherTool';

  constructor(
    private cache: CacheManager,
    private meteo = new OpenMeteoProvider(),
  ) {}

  async run(input: ToolInput): Promise<ToolResult> {
    const query = 'current';
    const { lat, lon } = input.location ?? {};
    const cached = this.cache.get<ToolResult>(this.capability, query);
    if (cached) return cached;

    const r = await this.meteo.getWeather(lat, lon);
    const citations = r ? [wxCite(r)] : [];
    const payload = r ? `${r.title}: ${r.content}` : '';

    const result: ToolResult = {
      capability: this.capability,
      success: citations.length > 0,
      confidence: citations.length ? citations[0].confidence : 0,
      timestamp: new Date().toISOString(),
      sources: citations,
      payload,
    };
    this.cache.set(this.capability, query, result);
    return result;
  }
}
