/**
 * ChatScreen — Production-Ready Chat Screen
 *
 * Architecture (top to bottom):
 *   SafeAreaView (edges: top only)
 *     └─ KeyboardAvoidingView (fills remaining space)
 *           ├─ ChatHeader
 *           ├─ MessageList (flex: 1, scrollable)
 *           └─ ChatInput (bottom, padded by safe-area inset)
 *
 * Keyboard handling strategy:
 *   - SafeAreaView handles TOP inset only (status bar clearance)
 *   - KeyboardAvoidingView handles keyboard push-up
 *   - ChatInput receives bottom safe-area inset as `paddingBottom`
 *
 * This is the only place KeyboardAvoidingView lives — NOT inside ChatInput.
 * Having KAV inside a child component causes double-offset bugs on iOS.
 *
 * Responsibilities:
 *   - Sources uid from auth store for API calls
 *   - Coordinates useChatStream hook
 *   - Passes derived state down to MessageList and ChatInput
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '@/core/store/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import { useChatStream } from '../hooks/useChatStream';
import type { ChatViewState } from '../types';

export function ChatScreen() {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingQuickStarter, setPendingQuickStarter] = useState<string | null>(null);

  // Get uid from the global auth store — required for x-uid API header
  const uid = useAppStore((state) => state.session.user?.uid ?? null);

  const { messages, isStreaming, refreshing, sendMessage, retryLast, clearError, abort, clearConversation, refreshConversation } =
    useChatStream({ uid });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const chatViewState: ChatViewState =
    isLoading && messages.length === 0
      ? 'loading'
      : messages.length === 0
        ? 'empty'
        : messages[messages.length - 1]?.status === 'error'
          ? 'error'
          : 'conversation';

  const handleQuickStarterSelect = useCallback((text: string) => {
    setPendingQuickStarter(text);
  }, []);

  const handlePrefillSent = useCallback(() => {
    setPendingQuickStarter(null);
  }, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background.primary }]}
      edges={['top']}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Fixed header */}
        <ChatHeader onMorePress={clearConversation} />

        {/* Scrollable message list — flex: 1 takes all remaining vertical space */}
        <MessageList
          messages={messages}
          refreshing={refreshing}
          viewState={chatViewState}
          onRefresh={refreshConversation}
          onQuickStarterSelect={handleQuickStarterSelect}
          onRetry={retryLast}
          onDismiss={clearError}
        />

        {/* Input area — bottom safe-area inset passed as paddingBottom */}
        <ChatInput
          onSend={sendMessage}
          onAbort={abort}
          isStreaming={isStreaming}
          paddingBottom={insets.bottom}
          prefillText={pendingQuickStarter}
          onPrefillSent={handlePrefillSent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
});

export default ChatScreen;
