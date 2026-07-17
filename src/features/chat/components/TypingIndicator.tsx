import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

const DOT_SIZE = 7;
const DOT_GAP = 5;

function AnimatedDot({ delay }: { delay: number }) {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-7, { duration: 360, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 360, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 360 }),
          withTiming(0.35, { duration: 360 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.dotWrapper, animStyle]}>
      <Svg width={DOT_SIZE} height={DOT_SIZE} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} />
            <Stop offset="100%" stopColor={colors.brand.secondary} />
          </LinearGradient>
        </Defs>
        <Circle cx="12" cy="12" r="12" fill="url(#dotGrad)" />
      </Svg>
    </Animated.View>
  );
}

export const TypingIndicator = React.memo(function TypingIndicator() {
  const { colors } = useTheme();
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1400 }), withTiming(0.35, { duration: 1400 })),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.5,
    transform: [{ scale: 1 + glow.value * 0.25 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + glow.value * 0.4,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}
      accessibilityLabel="Velness is reflecting for you"
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={[styles.glow, { backgroundColor: colors.brand.primary }, glowStyle]}
        pointerEvents="none"
      />
      <View style={styles.dotsRow}>
        <AnimatedDot delay={0} />
        <AnimatedDot delay={160} />
        <AnimatedDot delay={320} />
      </View>
      <Animated.Text style={[styles.label, { color: colors.text.secondary }, labelStyle]}>
        Velness is reflecting...
      </Animated.Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 18,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 6,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  glow: {
    position: 'absolute',
    left: -20,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOT_GAP,
    height: 16,
  },
  dotWrapper: {
    width: DOT_SIZE,
    height: DOT_SIZE,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

export default TypingIndicator;
