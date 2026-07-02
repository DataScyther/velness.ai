/**
 * MessageBubble
 *
 * Thin dispatcher that routes a ChatMessage to the correct bubble component:
 *   - user → UserMessageBubble
 *   - assistant (streaming, done) → AIMessageBubble
 *   - assistant (error) → ErrorBubble
 *
 * This is the only component that MessageList renders per item.
 * It keeps MessageList clean and ensures FlatList's renderItem is a
 * single stable reference.
 */

import React from 'react';
import type { ChatMessage } from '../types';
import { AIMessageBubble } from './AIMessageBubble';
import { UserMessageBubble } from './UserMessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ErrorBubble } from './ErrorBubble';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry: () => void;
  onDismiss: (id: string) => void;
}

export function MessageBubble({ message, onRetry, onDismiss }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <UserMessageBubble
        message={message.content}
        timestamp={message.timestamp}
      />
    );
  }

  // Assistant — streaming with no content yet: show typing indicator
  if (message.status === 'streaming' && message.content === '') {
    return <TypingIndicator />;
  }

  // Assistant — error state
  if (message.status === 'error') {
    return (
      <ErrorBubble
        message={message.errorMessage ?? 'Something went wrong. Tap to retry.'}
        onRetry={onRetry}
        onDismiss={() => onDismiss(message.id)}
      />
    );
  }

  // Assistant — streaming (has content) or done
  return (
    <AIMessageBubble
      message={message.content}
      timestamp={message.timestamp}
      isStreaming={message.status === 'streaming'}
    />
  );
}

export default MessageBubble;
