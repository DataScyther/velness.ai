/**
 * ErrorBubble
 *
 * Inline error display for failed AI responses.
 * Appears in the message list at the position of the failed message.
 *
 * Shows:
 *   - A friendly error message
 *   - "Retry" tap target (calls retryLast)
 *   - "Dismiss" X button (calls clearError)
 *
 * No modals, no toasts — inline only.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AlertCircle, RotateCcw, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface ErrorBubbleProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export function ErrorBubble({ message, onRetry, onDismiss }: ErrorBubbleProps) {
  const { colors } = useTheme();

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRetry();
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: `${colors.danger}12`,
            borderColor: `${colors.danger}40`,
          },
        ]}
      >
        {/* Icon + Message */}
        <View style={styles.topRow}>
          <AlertCircle
            size={15}
            color={colors.danger}
            strokeWidth={2}
            style={styles.icon}
          />
          <Text
            style={[styles.errorText, { color: colors.text.secondary }]}
            numberOfLines={3}
          >
            {message}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.danger, opacity: pressed ? 0.8 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Retry message"
          >
            <RotateCcw size={12} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [styles.dismissButton, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Dismiss error"
          >
            <X size={14} color={colors.text.secondary} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 60,
    marginVertical: 4,
    marginLeft: 46, // align with AI bubble content (avatar width + margin)
  },
  bubble: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
  },
});

export default ErrorBubble;
