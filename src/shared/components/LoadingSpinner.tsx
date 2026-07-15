/**
 * LoadingSpinner — Animated loading indicator
 *
 * Uses Reanimated for continuous rotation animation.
 */

import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { View } from 'react-native';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  trackColor?: string;
  strokeWidth?: number;
  className?: string;
}

export function LoadingSpinner({
  size = 32,
  color = '#8B5CF6',
  strokeWidth = 3,
  className = '',
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        withTiming(0, { duration: 1000, easing: Easing.linear }),
      ),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderTopColor: color,
  }));

  return (
    <View className={`items-center justify-center ${className}`}>
      <Animated.View style={animatedStyle} />
    </View>
  );
}

export default LoadingSpinner;
