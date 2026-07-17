/**
 * Velness — AI Runtime: Bootstrap
 *
 * Dependency injection point. Registers capability → tool mappings into the
 * ToolRegistry. Adding Exa/Tavily/PubMed/WHO later is a register() call here,
 * not a change to the orchestrator or router.
 */

import { ToolRegistry } from './tools/Tool';
import { CacheManager } from './cache/CacheManager';
import { KnowledgeTool } from './tools/KnowledgeTool';
import { NewsTool } from './tools/NewsTool';
import { WeatherTool } from './tools/WeatherTool';
import { MedicalTool } from './tools/MedicalTool';
import { MemoryTool } from './tools/MemoryTool';
import { AIOrchestrator } from './AIOrchestrator';
import { Capability } from './types';

export function createOrchestrator(): AIOrchestrator {
  const cache = new CacheManager();
  const registry = new ToolRegistry();
  const memory = new MemoryTool(cache);

  registry.register(new KnowledgeTool(cache));
  registry.register(new NewsTool(cache));
  registry.register(new WeatherTool(cache));
  registry.register(new MedicalTool(cache));
  registry.register(memory); // MEMORY
  registry.register(memory, Capability.PROFILE);
  registry.register(memory, Capability.JOURNEY);

  // RAG capability has no live tool yet — wired in Phase 4 without touching
  // the orchestrator or router.

  return new AIOrchestrator({ registry, cache });
}
