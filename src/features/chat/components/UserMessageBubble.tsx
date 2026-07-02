import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { MessageTimestamp } from './MessageTimestamp';

interface UserMessageBubbleProps {
  message: string;
  timestamp: string;
}

export function UserMessageBubble({ message, timestamp }: UserMessageBubbleProps) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.bubbleWrapper}>
        <View style={styles.bubble}>
          <Svg style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="userBubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.brand.secondary} />
                <Stop offset="100%" stopColor={colors.brand.primary} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={16} fill="url(#userBubbleGrad)" />
          </Svg>
          <Text style={[styles.messageText, { color: colors.brand.contrastText }]}>
            {message}
          </Text>
        </View>
        <MessageTimestamp timestamp={timestamp} style={styles.timestampStyle} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 6,
    width: '100%',
    paddingLeft: 60, // ensures the message bubble doesn't stretch too wide
  },
  bubbleWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  bubble: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  timestampStyle: {
    marginRight: 4,
  },
});


export default UserMessageBubble;
