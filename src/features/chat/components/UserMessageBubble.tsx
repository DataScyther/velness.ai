import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';

interface UserMessageBubbleProps {
  message: string;
  timestamp: string;
}

export function UserMessageBubble({ message, timestamp }: UserMessageBubbleProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.bubbleWrapper}>
        <View style={styles.bubble}>
          <Svg style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="userBubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#8B5CF6" />
                <Stop offset="100%" stopColor="#6D28D9" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={16} fill="url(#userBubbleGrad)" />
          </Svg>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <Text style={styles.timestampText}>{timestamp}</Text>
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
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  timestampText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
    marginTop: 4,
    marginRight: 4,
    fontWeight: '500',
  },
});

export default UserMessageBubble;
