/**
 * Velness — AI Runtime: Feature Flags & Observability
 *
 * Lightweight, dependency-free. Flags are read from environment at request
 * time so capabilities can be toggled without redeploys. Observability is
 * console-based for now and structured so it can be swapped for a real sink.
 */

import type { FeatureFlags, RequestTrace } from './types';

function flag(name: string, fallback = true): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw === 'true' || raw === '1';
}

export function getFeatureFlags(): FeatureFlags {
  return {
    ENABLE_KNOWLEDGE: flag('ENABLE_KNOWLEDGE'),
    ENABLE_NEWS: flag('ENABLE_NEWS'),
    ENABLE_WEATHER: flag('ENABLE_WEATHER'),
    ENABLE_MEDICAL: flag('ENABLE_MEDICAL'),
    ENABLE_MEMORY: flag('ENABLE_MEMORY'),
    ENABLE_CITATIONS: flag('ENABLE_CITATIONS'),
    ENABLE_RAG: flag('ENABLE_RAG', false),
  };
}

export function isCapabilityEnabled(cap: string, flags: FeatureFlags): boolean {
  switch (cap) {
    case 'KNOWLEDGE':
      return flags.ENABLE_KNOWLEDGE;
    case 'NEWS':
      return flags.ENABLE_NEWS;
    case 'WEATHER':
      return flags.ENABLE_WEATHER;
    case 'MEDICAL':
      return flags.ENABLE_MEDICAL;
    case 'MEMORY':
    case 'PROFILE':
    case 'JOURNEY':
      return flags.ENABLE_MEMORY;
    case 'RAG':
      return flags.ENABLE_RAG;
    default:
      return true;
  }
}

/** Minimal stopwatch for request traces. */
export class Timer {
  private start = Date.now();
  stop(): number {
    return Date.now() - this.start;
  }
}

/**
 * Emit a structured request trace. Console-only today; the shape is stable
 * so it can be forwarded to a real telemetry sink later without call-site
 * changes.
 */
export function logTrace(trace: RequestTrace): void {
  // eslint-disable-next-line no-console
  console.log(
    `[ai-trace] ${trace.requestId} intent=${trace.intentMs}ms provider=${trace.providerMs}ms llm=${trace.llmMs}ms total=${trace.totalMs}ms capabilities=${trace.capabilities.join(',')} tools=${trace.toolsUsed.join(',')} cacheHit=${trace.cacheHits.join(',')} cacheMiss=${trace.cacheMisses.join(',')}`,
  );
}
