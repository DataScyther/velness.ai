/**
 * TypingIndicator
 *
 * Three animated dots shown when the assistant is waiting to send its
 * first token. Once content starts arriving this component is unmounted
 * and the AIMessageBubble takes over.
 *
 * Design: matches the AIMessageBubble layout (avatar + bubble) so the
 * transition from indicator → bubble is seamless with no layout jump.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Brain } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const DOT_SIZE = 7;
const DOT_GAP = 5;

function AnimatedDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(0.3, { duration: 350 })
        ),
        -1,
        false
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 350 }),
          withTiming(0, { duration: 350 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animStyle]} />;
}

export function TypingIndicator() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Rainbow Brain Avatar — mirrors AIMessageBubble */}
      <View style={styles.avatarContainer}>
        <Svg width={36} height={36} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="rainbowGradTI" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="40%" stopColor="#A78BFA" />
              <Stop offset="75%" stopColor="#06B6D4" />
              <Stop offset="100%" stopColor="#EF4444" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={18} fill="url(#rainbowGradTI)" />
        </Svg>
        <Brain size={18} color="#FFFFFF" strokeWidth={2} />
      </View>

      {/* Dots Bubble */}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.surface.secondary,
            borderColor: colors.border.default,
          },
        ]}
      >
        <View style={styles.dotsRow}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={150} />
          <AnimatedDot delay={300} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    width: '100%',
    paddingRight: 60,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  bubble: {
    borderWidth: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#8B5CF6',
  },
});

export default TypingIndicator;
