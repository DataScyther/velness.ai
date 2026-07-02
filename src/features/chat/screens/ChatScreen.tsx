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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/core/store/useAppStore';
import { ChatHeader } from '../components/ChatHeader';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import { useChatStream } from '../hooks/useChatStream';
import type { ChatViewState } from '../types';
import { LAYOUT } from '@/shared/constants';

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const keyboardOffset = Platform.OS === 'ios' ? insets.top : 0;
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

  const inConversation = chatViewState === 'conversation';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ChatHeader
          title="Neeva AI"
          showBackButton={inConversation}
          onBackPress={clearConversation}
        />

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
          paddingBottom={insets.bottom + LAYOUT.TAB_BAR_HEIGHT + LAYOUT.CHAT_COMPOSER_SPACING}
          prefillText={pendingQuickStarter}
          onPrefillSent={handlePrefillSent}
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
});

export default ChatScreen;
