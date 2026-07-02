import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Brain, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { MessageTimestamp } from './MessageTimestamp';

interface AIMessageBubbleProps {
  message: string;
  timestamp: string;
  /** When true, shows a blinking cursor at the end of the message */
  isStreaming?: boolean;
}

export function AIMessageBubble({ message, timestamp, isStreaming = false }: AIMessageBubbleProps) {
  const { colors } = useTheme();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copyOpacity, setCopyOpacity] = useState(1);

  // Blinking cursor animation during streaming
  const cursorOpacity = useSharedValue(isStreaming ? 1 : 0);
  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));

  useEffect(() => {
    if (isStreaming) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      cursorOpacity.value = withTiming(0, { duration: 100 });
    }
  }, [isStreaming]);

  const handleCopy = useCallback(async () => {
    if (!message) return;
    await Clipboard.setStringAsync(message);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopyOpacity(0.7);
    setTimeout(() => setCopyOpacity(1), 200);
  }, [message]);

  const handleThumbsUp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeedback((prev) => (prev === 'up' ? null : 'up'));
  }, []);

  const handleThumbsDown = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeedback((prev) => (prev === 'down' ? null : 'down'));
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {/* Rainbow Brain Avatar */}
      <View style={styles.avatarContainer}>
        <Svg width={28} height={28} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="40%" stopColor="#A78BFA" />
              <Stop offset="75%" stopColor="#06B6D4" />
              <Stop offset="100%" stopColor="#EF4444" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={14} fill="url(#rainbowGrad)" />
        </Svg>
        <Brain size={14} color="#FFFFFF" strokeWidth={2} />
      </View>

      {/* Bubble Content */}
      <View style={styles.bubbleWrapper}>
        <Pressable onLongPress={handleCopy} style={{ opacity: copyOpacity }}>
          <View
            style={[
              styles.bubble,
              { backgroundColor: colors.surface.secondary },
            ]}
          >
            <Text style={[styles.messageText, { color: colors.text.primary }]}>
              {message}
              {isStreaming && (
                <Animated.Text style={[styles.cursor, { color: colors.brand.primary }, cursorStyle]}>
                  {'▍'}
                </Animated.Text>
              )}
            </Text>
          </View>
        </Pressable>
        <MessageTimestamp timestamp={timestamp} style={styles.timestampStyle} />
        {!isStreaming && message ? (
          <View style={styles.feedbackRow}>
            <Pressable
              onPress={handleThumbsUp}
              style={({ pressed }) => [styles.feedbackBtn, { opacity: pressed ? 0.6 : 1, borderColor: colors.border.default }]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Good response"
            >
              <ThumbsUp size={14} color={feedback === 'up' ? colors.brand.primary : colors.text.secondary} strokeWidth={2} />
            </Pressable>
            <Pressable
              onPress={handleThumbsDown}
              style={({ pressed }) => [styles.feedbackBtn, { opacity: pressed ? 0.6 : 1, borderColor: colors.border.default }]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Bad response"
            >
              <ThumbsDown size={14} color={feedback === 'down' ? colors.danger : colors.text.secondary} strokeWidth={2} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
    width: '100%',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '85%', // relative to the remaining space
  },
  bubble: {
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  timestampStyle: {
    marginLeft: 4,
  },
  cursor: {
    fontSize: 14,
    fontWeight: '300',
  },
  feedbackRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  feedbackBtn: {
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});


export default AIMessageBubble;
