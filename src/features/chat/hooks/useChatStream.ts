import { useState, useCallback, useRef, useEffect } from 'react';
import { streamChat, generateResponse } from '@/services/ai';
import { AIError } from '@/services/ai/types';
import { PerfTracker } from '@/utils/chat-performance';
import { MemoryManager } from '@/services/memory';
import { chatRepository } from '@/repositories/ChatRepository';
import type { ChatMessage } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${mm} ${ampm}`;
}

function classifyError(error: unknown): string {
  if (error instanceof AIError) {
    if (error.statusCode === 401) {
      return 'Session expired. Please sign in again.';
    }
    if (error.statusCode === 500 || error.statusCode === 502) {
      const detail =
        error.details && typeof error.details === 'string'
          ? `: ${error.details.slice(0, 200)}`
          : '';
      return `Server error${detail}. Tap to retry.`;
    }
    if (error.statusCode === 408) {
      return 'Request timed out. Tap to retry.';
    }
    const statusInfo = error.statusCode ? ` (HTTP ${error.statusCode})` : '';
    return `AI request failed${statusInfo}. Tap to retry.`;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes('network request failed') ||
      msg.includes('failed to fetch') ||
      msg.includes('networkerror')
    ) {
      return 'No internet connection. Check your network and tap to retry.';
    }
    if (msg.includes('abort') || msg.includes('signal')) {
      return 'Request was cancelled.';
    }
    if (msg.includes('timeout')) {
      return 'Request timed out. Tap to retry.';
    }
    return `${error.message}. Tap to retry.`;
  }

  return 'Something went wrong. Tap to retry.';
}

function buildHistory(
  messages: ChatMessage[],
  memoryManager?: MemoryManager | null
): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
  const doneMessages = messages
    .filter((m) => m.status === 'done' && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  if (memoryManager) {
    return memoryManager.buildCondensedHistory(doneMessages);
  }
  return doneMessages;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseChatStreamOptions {
  /** Firebase UID — required for the x-uid auth header */
  uid: string | null;
}

export interface UseChatStreamReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  refreshing: boolean;
  sendMessage: (text: string) => Promise<void>;
  retryLast: () => Promise<void>;
  clearError: (id: string) => void;
  /** Cancel an in-flight stream immediately */
  abort: () => void;
  /** Clear the entire conversation and abort any in-flight request */
  clearConversation: () => void;
  /** Trigger a refresh pulse that reloads from Firestore */
  refreshConversation: () => Promise<void>;
  /** Current conversation ID (lazily generated on first message) */
  conversationId: string | null;
  /** Regenerate the last assistant response */
  regenerateResponse: () => Promise<void>;
}

export function useChatStream({ uid }: UseChatStreamOptions): UseChatStreamReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const isStreamingRef = useRef(isStreaming);
  isStreamingRef.current = isStreaming;

  const retryingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const lastUserTextRef = useRef<string>('');
  const lastUserMessageIdRef = useRef<string>('');

  const conversationIdRef = useRef<string | null>(null);
  const memoryManagerRef = useRef<MemoryManager | null>(null);
  const isLoadedRef = useRef(false);
  const loadErrorRef = useRef<string | null>(null);

  // Sync conversationId state with ref for external exposure
  useEffect(() => {
    setConversationId(conversationIdRef.current);
  }, []);

  // ─── Cleanup on unmount ──────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  // ─── Hydrate conversation from Firestore on mount ────────────────────────────

  const hydrateConversation = useCallback(async () => {
    if (!uid) return;
    try {
      const latestId = await chatRepository.loadLatestConversationId(uid);
      if (latestId) {
        const loadedMessages = await chatRepository.loadConversationMessages(uid, latestId);
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
          conversationIdRef.current = latestId;
          setConversationId(latestId);
          memoryManagerRef.current = new MemoryManager(latestId);
        }
      }
    } catch (error) {
      loadErrorRef.current = 'Failed to load conversation';
      console.warn('[Chat] Hydration failed:', error);
    }
  }, [uid]);

  useEffect(() => {
    if (!uid || isLoadedRef.current) return;
    isLoadedRef.current = true;
    hydrateConversation();
  }, [uid, hydrateConversation]);

  // ─── Imperative message updater ─────────────────────────────────────────────

  const updateMessage = useCallback(
    (id: string, updater: (msg: ChatMessage) => ChatMessage) => {
      setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
    },
    []
  );

  // ─── Summarization ──────────────────────────────────────────────────────────

  const summarizeConversation = useCallback(async () => {
    if (!uid) return;
    const currentMsgs = messagesRef.current;
    const fullHistory = currentMsgs
      .filter((m) => m.status === 'done' && (m.role === 'user' || m.role === 'assistant'))
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    if (fullHistory.length === 0) return;

    try {
      const response = await generateResponse({
        text: 'Summarize this conversation in 2-3 sentences, focusing on key topics discussed and the user\'s emotional state.',
        uid,
        history: fullHistory,
      });
      memoryManagerRef.current?.setSummary(response.content);
    } catch (error) {
      console.warn('[Chat] Summarization failed:', error);
    }
  }, [uid]);

  // ─── Core streaming logic ────────────────────────────────────────────────────

  const executeStream = useCallback(
    async (text: string, historyContext: ChatMessage[]) => {
      if (!uid) {
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: formatTime(new Date()),
          status: 'error',
          errorMessage: 'Sign in required to chat with Neeva.',
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // 30-second timeout safety net
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30_000);

      // Build history from context messages with optional memory manager
      const history = buildHistory(historyContext, memoryManagerRef.current);

      // Optimistic assistant placeholder (typing indicator state)
      const assistantId = generateId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: formatTime(new Date()),
        status: 'streaming',
      };

      setMessages((prev) => [...prev, assistantPlaceholder]);
      setIsStreaming(true);

      let hasContent = false;

      try {
        for await (const chunk of streamChat({
          text,
          uid,
          history,
          signal: controller.signal,
          memoryContext: memoryManagerRef.current?.buildContext(),
        })) {
          if (chunk.done) break;

          if (chunk.contentDelta) {
            hasContent = true;
            updateMessage(assistantId, (msg) => ({
              ...msg,
              content: msg.content + chunk.contentDelta,
            }));
          }
        }

        // Mark complete
        updateMessage(assistantId, (msg) => ({
          ...msg,
          status: 'done',
          content: hasContent
            ? msg.content
            : "I'm sorry, I wasn't able to generate a response. Please try again.",
        }));
      } catch (error) {
        // Don't surface abort errors if user initiated cancellation
        if (error instanceof Error && error.name === 'AbortError') {
          updateMessage(assistantId, (msg) => ({
            ...msg,
            status: 'error',
            errorMessage: 'Request cancelled.',
          }));
          return;
        }

        if (error instanceof AIError) {
          console.error('[Chat] AI request failed — status:', error.statusCode, 'body:', error.details);
        } else {
          console.error('[Chat] AI stream error:', error);
        }

        const friendly = classifyError(error);
        updateMessage(assistantId, (msg) => ({
          ...msg,
          status: 'error',
          errorMessage: friendly,
        }));
        hasContent = false;
      } finally {
        clearTimeout(timeoutId);
        setIsStreaming(false);
        abortRef.current = null;
      }

      // ── Persist to Firestore after successful stream ──
      if (hasContent && uid && conversationIdRef.current) {
        const currentMsgs = messagesRef.current;
        const toSave = currentMsgs.filter((m) => m.status === 'done');

        if (toSave.length > 0) {
          chatRepository
            .saveMessages(uid, toSave, conversationIdRef.current)
            .then(() => {
              memoryManagerRef.current?.incrementTurn();
              if (memoryManagerRef.current?.needsSummarization()) {
                summarizeConversation();
              }
            })
            .catch((err) => console.warn('[Chat] Firestore save failed:', err));
        }
      }
    },
    [uid, updateMessage, summarizeConversation]
  );

  // ─── Public API ──────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreamingRef.current) return;

      lastUserTextRef.current = trimmed;

      // Lazy-generate conversation ID on first message
      if (!conversationIdRef.current) {
        const newId = generateId();
        conversationIdRef.current = newId;
        setConversationId(newId);
        memoryManagerRef.current = new MemoryManager(newId);
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: formatTime(new Date()),
        status: 'done',
      };
      lastUserMessageIdRef.current = userMessage.id;

      // Read the latest messages via ref — avoids stale closure issues.
      const historyContext = messagesRef.current;

      // Append user message optimistically
      setMessages((prev) => [...prev, userMessage]);

      // Execute stream with correct history (everything before the current message)
      await executeStream(trimmed, historyContext);
    },
    [executeStream]
  );

  const retryLast = useCallback(async () => {
    if (isStreamingRef.current || retryingRef.current || !lastUserTextRef.current) return;
    retryingRef.current = true;

    // Remove the last error assistant message (if any) before retrying
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.status === 'error' && lastMsg.role === 'assistant') {
        return prev.slice(0, -1);
      }
      return prev;
    });

    // Build history context from latest messages (via ref, not stale closure)
    const latestMessages = messagesRef.current;
    const cleanMessages = latestMessages.filter(
      (m) => !(m.status === 'error' && m.role === 'assistant')
    );

    // Find and exclude the last user message (that's the one we're retrying)
    let lastUserIdx = -1;
    for (let i = cleanMessages.length - 1; i >= 0; i--) {
      if (cleanMessages[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }
    const historyContext = lastUserIdx >= 0 ? cleanMessages.slice(0, lastUserIdx) : [];

    try {
      await executeStream(lastUserTextRef.current, historyContext);
    } finally {
      retryingRef.current = false;
    }
  }, [executeStream]);

  const clearError = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setIsStreaming(false);
    lastUserTextRef.current = '';
    const newId = generateId();
    conversationIdRef.current = newId;
    setConversationId(newId);
    memoryManagerRef.current = new MemoryManager(newId);
  }, []);

  const refreshConversation = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setRefreshing(true);

    const startTime = Date.now();

    if (uid && conversationIdRef.current) {
      try {
        const loaded = await chatRepository.loadConversationMessages(uid, conversationIdRef.current);
        setMessages((prev) => {
          const merged = new Map<string, ChatMessage>();
          for (const m of prev) merged.set(m.id, m);
          for (const m of loaded) merged.set(m.id, m);
          return Array.from(merged.values());
        });
      } catch (error) {
        console.warn('[Chat] Refresh load failed:', error);
      }
    }

    const elapsed = Date.now() - startTime;
    if (elapsed < 600) {
      await new Promise((resolve) => setTimeout(resolve, 600 - elapsed));
    }

    setRefreshing(false);
    isRefreshingRef.current = false;
  }, [uid]);

  const regenerateResponse = useCallback(async () => {
    const msgs = messagesRef.current;
    const lastAssistantIdx = msgs.length - 1;

    if (lastAssistantIdx < 0 || msgs[lastAssistantIdx].role !== 'assistant') return;
    if (isStreamingRef.current) return;

    setMessages((prev) => prev.slice(0, -1));

    let lastUserText = '';
    for (let i = msgs.length - 2; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserText = msgs[i].content;
        break;
      }
    }

    if (!lastUserText) return;

    const cleanHistory = msgs.slice(0, lastAssistantIdx).filter(
      (m) => !(m.status === 'error' && m.role === 'assistant')
    );

    await executeStream(lastUserText, cleanHistory);
  }, [executeStream]);

  return {
    messages,
    isStreaming,
    refreshing,
    conversationId,
    sendMessage,
    retryLast,
    clearError,
    abort,
    clearConversation,
    refreshConversation,
    regenerateResponse,
  };
}
