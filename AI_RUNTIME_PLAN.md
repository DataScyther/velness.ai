# Velness AI Runtime — Implementation Plan (Phases 1–3 + 7.1, with 4–8 stubbed)

## Status of decisions (all LOCKED)

- **Architecture split**: Client (`src/`) = UI, local memory, safety checks, request submission. Edge Runtime (`api/ai/`) = orchestration, tool routing, live search, citations, caching, prompt assembly, model gateway. `api/ai/chat.ts` = thin entrypoint delegating to the runtime.
- **Tool abstraction = capability layer** (NewsTool, KnowledgeTool, WeatherTool, MedicalTool), NOT provider-named classes. Orchestrator asks for a *capability*, the router picks a provider.
- **Provider priority (free first)**: Wikipedia → Open-Meteo → Google News RSS (Level 1 free). Exa (primary premium) + Tavily (fallback) = Level 2 (keys added later, code ready). PubMed/WHO/NIH/NHS/CDC = Level 3 medical (medical tool interface ready, Wikipedia/Exa cover general for now).
- **Intent**: Nemotron-driven classification (one cheap chat call with a structured JSON contract, or tool-calling) decides which capability(ies) to invoke.
- **Cache**: Phase 7.1 in-memory TTL `Map` under `api/ai/cache/`. Phase 7.2 Vercel KV later. NEVER Supabase as cache.
- **Backend freeze**: Phase 4 (RAG/pgvector) and Phase 8 (autonomous) are **interface-complete, implementation-stubbed** — zero schema/migration changes.
- **First pass deliverable**: end-to-end vertical slice (Sprint A–F below) + stubbed interfaces for 4–8.

---

## Current-state findings (why this plan is shaped this way)

1. **Client currently calls NVIDIA directly** with public `VITE_NVIDIA_API_KEY` via `src/services/ai/providers/NvidiaProvider.ts`. The edge function `api/ai/chat.ts` is **orphaned** — nothing imports `src/utils/ai-service.ts` (the only client that targets `/api/ai/chat`).
2. **Wire-format mismatch**: `NvidiaProvider` parses SSE `data:` frames; `api/ai/chat.ts` emits newline-delimited JSON (`JSON.stringify(chunk)+'\n'`). The orphaned `src/utils/ai-service.ts` already parses NDJSON correctly — so we reuse it as the new client bridge.
3. **Memory layer already exists**: `MemoryManager` (`src/services/memory/MemoryManager.ts`) builds `AIContext`; `buildContextualPrompt` (`src/prompts/mentalWellnessPrompt.ts`) injects it. BUT `NvidiaProvider.buildSystemMessage` **drops** `summary/goals/reflectionStreak/currentJourney/preferences/recentTopics`. The server runtime will fix this by forwarding the full context.
4. **No cache/search/vector infra exists.** Only `zod` + `@supabase/supabase-js` are present. New deps: none required for the vertical slice (native `fetch` for providers; `Map` for cache). Paid search keys (Exa/Tavily) added later as `EXA_API_KEY`/`TAVILY_API_KEY` in `.env`.
5. **Edge function typechecks** against root `tsconfig` (no separate `api/tsconfig.json`). `.env` already has server-only `NVIDIA_API_KEY` (read by `chat.ts:151`) — but `.env.example` does NOT document it; we'll add it.

---

## Target runtime structure

```
api/ai/
├── chat.ts                      # THIN entrypoint: parse req → delegate to runtime → stream
├── runtime/
│   ├── AIOrchestrator.ts        # receives every request; orchestrates the pipeline
│   ├── IntentClassifier.ts      # Nemotron-driven intent → capability list
│   ├── ToolRouter.ts            # maps capability → concrete tool
│   ├── ContextBuilder.ts        # merges memory + tools + RAG(stub) → unified prompt context
│   ├── PromptAssembler.ts       # builds final system+user messages (reuses mentalWellnessPrompt logic)
│   ├── ModelGateway.ts          # wraps NVIDIA streaming call (moved from NvidiaProvider)
│   ├── types.ts                 # AIRequest, AIResponse, ToolResult, Citation, Capability enums
│   ├── tools/
│   │   ├── Tool.ts              # Tool interface (capability-aware)
│   │   ├── KnowledgeTool.ts     # Wikipedia (Exa/Tavily wired as optional providers)
│   │   ├── NewsTool.ts          # Google News RSS (+ Exa news optional)
│   │   ├── WeatherTool.ts       # Open-Meteo (weather + air quality)
│   │   ├── MedicalTool.ts       # interface; Wikipedia/Exa cover general; PubMed later
│   │   ├── MemoryTool.ts        # reads memoryContext already sent by client
│   │   ├── ProfileTool.ts       # optional future (stub)
│   │   └── providers/
│   │       ├── WikipediaProvider.ts
│   │       ├── OpenMeteoProvider.ts
│   │       ├── GoogleNewsRssProvider.ts
│   │       ├── ExaProvider.ts        # reads EXA_API_KEY; used when set
│   │       └── TavilyProvider.ts     # reads TAVILY_API_KEY; fallback
│   ├── citations/
│   │   └── CitationService.ts   # attaches source + timestamp + confidence to each tool result
│   ├── rag/
│   │   ├── RetrievalTool.ts     # interface
│   │   └── NotImplementedRetrievalTool.ts  # returns [] (freeze-safe stub)
│   └── autonomous/
│       ├── InsightEngine.ts     # interface + no-op stub
│       ├── PredictionEngine.ts  # interface + no-op stub
│       └── RecommendationEngine.ts # interface + no-op stub
└── cache/
    ├── CacheManager.ts          # get/set with per-key TTL + capability namespace
    ├── MemoryCache.ts           # Map<string,{value,expiresAt}>
    └── TTL.ts                   # capability → ttl map (weather 10m, news 5m, wiki 24h)
```

Client-side changes (minimal, preserve existing `StreamChunk` `{id,contentDelta,done}` contract):
- Add `src/services/ai/providers/EdgeRuntimeProvider.ts` implementing the existing `AIProvider` interface, delegating to a fixed `streamAIChat` (NDJSON) client.
- Repoint `src/services/ai/index.ts` `getProvider()` to `EdgeRuntimeProvider` (or gate via env flag `VITE_USE_EDGE_RUNTIME`).
- Extend `AIStreamParams.memoryContext` to carry the full `AIContext` (already typed in `src/services/memory/types.ts`) so the server forwards it into the prompt (closes the dropped-context gap).
- Reuse the existing orphaned `src/utils/ai-service.ts` `streamAIChat` parser as the new client transport (it already speaks NDJSON).

---

## Sprint A — AI Runtime Foundation

**Goal**: Replace direct NVIDIA call with a server-side runtime; preserve streaming.

1. **`api/ai/runtime/types.ts`**
   - `Capability` enum: `GENERAL | NEWS | WEATHER | KNOWLEDGE | MEDORY | PROFILE | RAG | MEDICAL | EMERGENCY`.
   - `AIRequest`: `{ text, history, memoryContext, mode }`.
   - `ToolResult`: `{ capability, content, citations: Citation[] }`.
   - `Citation`: `{ title, url, source, publishedAt?, snippet?, confidence }`.
   - `AIResponse` chunk shape stays `{ id, contentDelta, done? }` (unchanged wire contract).

2. **`api/ai/runtime/ModelGateway.ts`** — move NVIDIA streaming logic out of `NvidiaProvider.ts` into the edge runtime (uses server-only `NVIDIA_API_KEY`, `VITE_NVIDIA_MODEL`/`process.env`). Exposes `streamCompletion(messages, mode): AsyncGenerator<StreamChunk>`.

3. **`api/ai/runtime/PromptAssembler.ts`** — port `buildContextualPrompt` + `buildSystemPrompt` logic from `src/prompts/mentalWellnessPrompt.ts` (server-side copy; edge runtime can't import `src/` which pulls RN/Expo). Forward the FULL `memoryContext` (fixes the dropped `summary/goals/streak/journey/preferences/recentTopics`).

4. **`api/ai/chat.ts`** — strip orchestration; keep only: CORS/OPTIONS, parse body, validate `uid` (`x-uid`), call `AIOrchestrator.handle(req)`, pipe returned `ReadableStream` back. Keep NDJSON wire format (`JSON.stringify(chunk)+'\n'`).

5. **`api/ai/runtime/AIOrchestrator.ts`** — `handle(request)`: build `AIRequest` → `IntentClassifier` → `ToolRouter` → run tools (parallel) → `ContextBuilder` → `ModelGateway.stream` → yield chunks. Single chokepoint for ALL AI traffic.

**Validation**: existing conversations still stream; no UI regression; server keeps `NVIDIA_API_KEY` secret.

---

## Sprint B — Intent + Capability Router

1. **`IntentClassifier.ts`** — Nemotron-driven. One fast classification call (or tool-calling on the same model) returning `{ capabilities: Capability[], needsSearch: boolean }` as structured JSON (use `temperature:0`, `response_format`/JSON parse). Fallback heuristic: keyword/regex rules if the model call fails (so latency stays low for `MEMORY`/`GENERAL`).
   - Examples: "what's today's AI news" → `[NEWS, KNOWLEDGE]`; "I feel anxious" → `[MEMORY]` (no search); "should I exercise, it's raining?" → `[WEATHER, MEMORY]`.
2. **`ToolRouter.ts`** — maps each `Capability` to a `Tool` instance via a registry. Knows capabilities, not providers. `getTools(capabilities): Tool[]`.
3. **`tools/Tool.ts`** — `interface Tool { capability: Capability; run(query, ctx): Promise<ToolResult>; }`.

---

## Sprint C — Free Provider Layer (no new secrets)

1. **`providers/WikipediaProvider.ts`** — REST `api.wikipedia.org/w/api.php` (extract + summary). No key.
2. **`providers/OpenMeteoProvider.ts`** — `api.open-meteo.com` (current weather) + `air-quality-api.open-meteo.com` (AQI). No key.
3. **`providers/GoogleNewsRssProvider.ts`** — `news.google.com/rss/search?q=...` parsed to headlines + links. No key.
4. **`KnowledgeTool`** wraps Wikipedia; adds Exa/Tavily when their keys are present (graceful: if `EXA_API_KEY` unset, skip). **`NewsTool`** wraps Google News RSS (+ Exa news optional). **`WeatherTool`** wraps Open-Meteo. **`MedicalTool`** interface ready; for now delegates general queries to KnowledgeTool (PubMed/WHO wiring deferred to when keys + freeze review allow). Each tool returns `ToolResult` with `citations`.
5. **`MemoryTool`** — consumes `memoryContext` already in the request (no network call); surfaces mood/goals/streak/journey to `ContextBuilder`.

---

## Sprint D — Citation Engine

1. **`citations/CitationService.ts`** — normalizes every `ToolResult` into `Citation[]` (title, url, source name, publishedAt, snippet, confidence 0–1). Deduplicates by URL. `ContextBuilder` appends a `## Sources` block to the prompt and the final streamed response includes a structured `citations` side-channel (sent as a terminal JSON chunk `{ id, done:true, citations:[...] }` so the client can render a sources list without parsing prose).

---

## Sprint E — Phase 7.1 In-memory TTL Cache

1. **`cache/TTL.ts`** — `Record<Capability, number>`: weather 600s, news 300s, wikipedia 86400s, medical 86400s, ai-news 600s.
2. **`cache/MemoryCache.ts`** — `Map<string,{value,expiresAt}>` with `get/set/has/cleanup`.
3. **`cache/CacheManager.ts`** — `get(capability, key)` / `set(capability, key, value)`. Key = normalized query (lowercased, trimmed). Tool layer checks cache BEFORE calling provider; on miss, stores result. Validates the Search→Cache→Return pattern with zero infra. (Phase 7.2 migration to Vercel KV is a drop-in swap of `MemoryCache` only.)

---

## Sprint F — Client → Edge Runtime Rewire

1. **`src/services/ai/providers/EdgeRuntimeProvider.ts`** — implements existing `AIProvider` (`streamChat`/`generateResponse`). Body: POST `{text, history, memoryContext, mode}` to `${env.apiBaseUrl}/ai/chat` with `x-uid` header; parse NDJSON stream into `StreamChunk`. Reuses `src/utils/ai-service.ts` `streamAIChat` as the transport (already correct).
2. **`src/services/ai/index.ts`** — set `getProvider()` to return `EdgeRuntimeProvider` when `env.useEdgeRuntime !== false` (default on). Keep `NvidiaProvider` as fallback for offline/dev-without-edge.
3. **`src/services/ai/types.ts`** — extend `memoryContext` to the full `AIContext` shape so the server receives summary/goals/streak/journey/preferences/recentTopics (closes the dropped-context gap identified in exploration).
4. **`useChatStream.ts`** — no structural change needed; it already passes `memoryContext: memoryManagerRef.current?.buildContext()`. Ensure the final `done` chunk's `citations` are captured and rendered (add a `sources` field to `Message.metadata`).

**Validation**: client never calls NVIDIA directly; all AI flows through the edge runtime; streaming latency unchanged or improved; citations render.

---

## Stubbed interfaces (freeze-safe, no DB changes)

- **`runtime/rag/RetrievalTool.ts`** + `NotImplementedRetrievalTool.ts` → `retrieve()` returns `[]`. Phase 4 later plugs in pgvector + embeddings + Supabase RPC *without* touching orchestration.
- **`runtime/autonomous/InsightEngine.ts`, `PredictionEngine.ts`, `RecommendationEngine.ts`** → interface + no-op. Phase 8 later implements weekly summaries, mood prediction, adaptive journeys (likely server-side cron / Supabase functions, not client).

---

## Env / config changes

- `api/ai/chat.ts` already reads `process.env.NVIDIA_API_KEY` — **add `NVIDIA_API_KEY` (server-only) to `.env.example`** next to the service-role slot (matches AGENTS.md secret pattern).
- Add optional `EXA_API_KEY`, `TAVILY_API_KEY` (server-only) to `.env.example` — code reads them; providers no-op if absent.
- No `vercel.json` change needed (it already excludes `api/` from SPA rewrite, so Vercel auto-deploys `api/ai/chat.ts` as an edge function). Dev mounting already works via `vite.config.ts` `apiDevPlugin`.

## Tests (vitest, `npm run test`)

- `IntentClassifier.test.ts` — intent mapping for sample inputs (mock the model call).
- `ToolRouter.test.ts` — capability → tool resolution.
- `CacheManager.test.ts` — TTL hit/miss/expiry.
- `CitationService.test.ts` — dedup + normalization.
- `providers/WikipediaProvider.test.ts`, `OpenMeteoProvider.test.ts`, `GoogleNewsRssProvider.test.ts` — mock `fetch`, assert `ToolResult`+citations shape.
- `AIOrchestrator.test.ts` — full pipeline with stubbed gateway + tools; assert streamed chunks + terminal citations chunk.
- Add to `vitest.config.ts` include if needed (currently `src/**/*.test.ts` — add `api/**/*.test.ts`).

## Execution order (locked)

| Sprint | Deliverable | Action |
|--------|-------------|--------|
| A | AI Runtime Foundation (chat.ts thin + Orchestrator + Gateway + PromptAssembler + types) | Build |
| B | IntentClassifier + ToolRouter + Tool interface | Build |
| C | Free providers (Wikipedia, Open-Meteo, Google News RSS) + Knowledge/News/Weather/Memory/Medical tools | Build |
| D | CitationService | Build |
| E | CacheManager + MemoryCache + TTL | Build |
| F | Client rewire (EdgeRuntimeProvider + index.ts + memoryContext extension + sources UI) | Build |
| — | RAG + Autonomous interfaces (stub) | Stub |
| — | `.env.example` + tests | Build |

## Success criteria (end of first pass)

Velness can: accept a message → route through Edge AI Runtime → classify intent → invoke correct capability → retrieve live info from free providers when appropriate → assemble unified context (memory + live + RAG-stub) → call Nemotron → stream response → include citations → cache repeated lookups in memory. RAG/embeddings/autonomous intelligence are interface-ready, zero backend schema changes.
