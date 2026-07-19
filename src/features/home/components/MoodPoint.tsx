import React, { useEffect } from 'react';
import { Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';



interface MoodPointProps {
  cx: number;
  cy: number;
  moodLevel: number | null;
  isToday?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MoodPoint = React.memo(({ cx, cy, moodLevel, isToday }: MoodPointProps) => {
  const { colors } = useTheme();
  
  // Staggered pulse indicators for today's node
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0.5);

  useEffect(() => {
    if (isToday) {
      pulse1.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(0, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
        ),
        -1,
        false
      );

      pulse2.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(0.5, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
        ),
        -1,
        false
      );
    }
  }, [isToday, pulse1, pulse2]);

  // Ripple calculations
  const ripple1Props = useAnimatedProps(() => ({
    r: 6 + pulse1.value * 14,
    opacity: 0.38 * (1 - pulse1.value),
  }));

  const ripple2Props = useAnimatedProps(() => ({
    r: 6 + ((pulse2.value + 0.5) % 1) * 14,
    opacity: 0.38 * (1 - ((pulse2.value + 0.5) % 1)),
  }));

  const activeColor = moodLevel !== null ? colors.moodScale[moodLevel as 1 | 2 | 3 | 4 | 5] : colors.brand.primary;

  if (isToday) {
    return (
      <G>
        {/* Concentric Pulse 1 */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          fill={activeColor}
          animatedProps={ripple1Props}
        />
        {/* Concentric Pulse 2 */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          fill={activeColor}
          animatedProps={ripple2Props}
        />
        
        {/* Outer Aura Halo */}
        <Circle
          cx={cx}
          cy={cy}
          r={9}
          fill={activeColor}
          opacity={0.15}
        />

        {/* Specular glass boundary */}
        <Circle
          cx={cx}
          cy={cy}
          r={6.5}
          stroke={activeColor}
          strokeWidth={1.5}
          fill={colors.surface.primary}
        />

        {/* Core Jewel */}
        <Circle
          cx={cx}
          cy={cy}
          r={4}
          fill={activeColor}
        />

        {/* specular reflection micro-dot */}
        <Circle
          cx={cx - 1.2}
          cy={cy - 1.2}
          r={1.2}
          fill="#FFFFFF"
          opacity={0.9}
        />
      </G>
    );
  }

  if (moodLevel !== null) {
    const pointColor = colors.moodScale[moodLevel as 1 | 2 | 3 | 4 | 5] || colors.moodScale[3];
    return (
      <G>
        {/* Soft radial glow shadow */}
        <Circle
          cx={cx}
          cy={cy}
          r={9}
          fill={pointColor}
          opacity={0.12}
        />

        {/* Jewel outer rim */}
        <Circle
          cx={cx}
          cy={cy}
          r={5.5}
          stroke={pointColor}
          strokeWidth={1}
          fill={colors.surface.primary}
        />

        {/* Core color */}
        <Circle
          cx={cx}
          cy={cy}
          r={3.5}
          fill={pointColor}
        />

        {/* Specular dot */}
        <Circle
          cx={cx - 0.8}
          cy={cy - 0.8}
          r={1}
          fill="#FFFFFF"
          opacity={0.8}
        />
      </G>
    );
  }

  // Placeholders for empty check-in nodes
  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={5}
        fill="none"
        stroke={colors.border.default}
        strokeWidth={0.8}
        opacity={0.2}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={3}
        fill="none"
        stroke={colors.border.default}
        strokeWidth={1.2}
        strokeDasharray="2 2"
        opacity={0.55}
      />
    </G>
  );
});

MoodPoint.displayName = 'MoodPoint';


