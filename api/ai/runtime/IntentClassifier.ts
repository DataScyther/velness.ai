/**
 * Velness — AI Runtime: Intent Classifier
 *
 * Decides which capabilities a request needs. Primary path: a fast, cheap
 * Nemotron call returning structured JSON. Fallback: a deterministic keyword
 * heuristic so MEMORY/GENERAL requests stay low-latency even if the model
 * call fails. The classifier NEVER executes tools — it only classifies.
 */

import { Capability, type Intent, type ChatHistoryMessage, type MemoryContext } from './types';

interface ClassifyDeps {
  classifyViaModel: (text: string, history: ChatHistoryMessage[]) => Promise<Intent | null>;
}

const HEURISTICS: Array<{ test: RegExp; capability: Capability }> = [
  { test: /\b(weather|temperature|rain|sunny|air quality|aqi|wind|forecast|humid)\b/i, capability: Capability.WEATHER },
  { test: /\b(news|headline|today'?s ai|latest|happening|breaking|reuters|ap\b|published today)\b/i, capability: Capability.NEWS },
  { test: /\b(cbt|cognitive behavioral|meditation|pubmed|who|nih|nhs|cdc|clinical|diagnosis|symptom|medical)\b/i, capability: Capability.MEDICAL },
  { test: /\b(what is|who is|define|explain|history of|how does|wiki|science|fact)\b/i, capability: Capability.KNOWLEDGE },
];

function heuristicIntent(text: string): Intent {
  const caps = new Set<Capability>();
  for (const h of HEURISTICS) {
    if (h.test.test(text)) caps.add(h.capability);
  }
  // Emotional / personal sharing → memory only, no search.
  const personal = /\b(i feel|i'm feeling|i am feeling|anxious|sad|happy|tired|lonely|stressed|overwhelmed|grateful)\b/i.test(text);
  if (personal) caps.add(Capability.MEMORY);
  if (caps.size === 0) caps.add(Capability.GENERAL);

  return {
    capabilities: Array.from(caps),
    needsSearch: caps.has(Capability.NEWS) || caps.has(Capability.WEATHER) || caps.has(Capability.KNOWLEDGE) || caps.has(Capability.MEDICAL),
  };
}

export class IntentClassifier {
  constructor(private deps: ClassifyDeps) {}

  async classify(
    text: string,
    history: ChatHistoryMessage[],
    _ctx?: MemoryContext,
  ): Promise<Intent> {
    try {
      const modelIntent = await this.deps.classifyViaModel(text, history);
      if (modelIntent && modelIntent.capabilities.length > 0) {
        return modelIntent;
      }
    } catch {
      // fall through to heuristic
    }
    return heuristicIntent(text);
  }
}

/** Build the system+user messages for the model-based classifier. */
export function buildClassifierMessages(text: string): Array<{ role: 'system' | 'user'; content: string }> {
  return [
    {
      role: 'system',
      content: `You are a routing classifier for an AI wellness companion. Given a user message, output ONLY JSON: {"capabilities":[...],"needsSearch":boolean}. Capabilities must be from: GENERAL, KNOWLEDGE, NEWS, WEATHER, MEDICAL, MEMORY, PROFILE, JOURNEY, RAG, EMERGENCY. Use MEMORY for emotional/personal sharing. Use WEATHER/NEWS/KNOWLEDGE/MEDICAL when live or factual info is needed.`,
    },
    { role: 'user', content: text },
  ];
}
