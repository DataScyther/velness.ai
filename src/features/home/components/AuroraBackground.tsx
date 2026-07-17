/**
 * AuroraBackground — Premium animated radial gradient background.
 *
 * Rendered using react-native-svg RadialGradients to achieve smooth,
 * high-fidelity blur glows without heavy image assets or performance drops.
 * Features:
 *   - Solid dark baseline (#0B0B12)
 *   - Soft floating purple radial glow
 *   - Soft floating cyan radial glow
 *   - Subtly animated positions, scale, and opacity using Reanimated at 60 FPS
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Premium baseline background color
const BACKGROUND_COLOR = '#0B0B12';

// Large gradient dimensions to facilitate soft, edge-free feathering
const PURPLE_ORB_SIZE = SCREEN_WIDTH * 1.4;
const CYAN_ORB_SIZE = SCREEN_WIDTH * 1.5;

interface AuroraBackgroundProps {
  /** Optional multiplier to scale overall glow intensity (default: 1) */
  intensity?: number;
}

export function AuroraBackground({ intensity = 1 }: AuroraBackgroundProps) {
  // ── Animation Controllers ──────────────────────────────────────────────
  const animationProgress = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Respect OS "Reduce Motion": park the orbs at a neutral frame instead
    // of running the continuous loop (avoids jank / motion sickness).
    if (reduced) {
      animationProgress.value = 0.5;
      return;
    }
    // A single unified slow time base loop for organic phase alignments
    animationProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 15000,
          easing: Easing.bezier(0.37, 0, 0.63, 1), // smooth ease-in-out
        }),
        withTiming(0, {
          duration: 15000,
          easing: Easing.bezier(0.37, 0, 0.63, 1),
        }),
      ),
      -1, // infinite loop
      false
    );
  }, [animationProgress, reduced]);

  // ── Animated Purple Orb Styles ─────────────────────────────────────────
  const purpleOrbStyle = useAnimatedStyle(() => {
    'worklet';
    const tx = interpolate(animationProgress.value, [0, 1], [-60, 40]);
    const ty = interpolate(animationProgress.value, [0, 1], [-80, -20]);
    const scale = interpolate(animationProgress.value, [0, 0.5, 1], [0.95, 1.1, 0.95]);
    const opacity = interpolate(animationProgress.value, [0, 0.5, 1], [0.85, 1, 0.85]);

    return {
      transform: [
        { translateX: tx } as const,
        { translateY: ty } as const,
        { scale: scale } as const,
      ] as any,
      opacity: opacity * intensity,
    };
  });

  // ── Animated Cyan Orb Styles ───────────────────────────────────────────
  const cyanOrbStyle = useAnimatedStyle(() => {
    'worklet';
    // Counter-motion and phase shift to make movement look natural
    const tx = interpolate(animationProgress.value, [0, 1], [40, -40]);
    const ty = interpolate(animationProgress.value, [0, 1], [-40, -90]);
    const scale = interpolate(animationProgress.value, [0, 0.5, 1], [1.05, 0.9, 1.05]);
    const opacity = interpolate(animationProgress.value, [0, 0.5, 1], [0.75, 0.95, 0.75]);

    return {
      transform: [
        { translateX: tx } as const,
        { translateY: ty } as const,
        { scale: scale } as const,
      ] as any,
      opacity: opacity * intensity,
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background layer */}
      <View style={styles.absoluteBackground} />

      {/* Floating Purple Orb */}
      <Animated.View style={[styles.purpleContainer, purpleOrbStyle]}>
        <Svg width={PURPLE_ORB_SIZE} height={PURPLE_ORB_SIZE}>
          <Defs>
            <RadialGradient
              id="purpleGlow"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
            >
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.22} />
              <Stop offset="30%" stopColor="#8B5CF6" stopOpacity={0.12} />
              <Stop offset="70%" stopColor="#7C3AED" stopOpacity={0.04} />
              <Stop offset="100%" stopColor={BACKGROUND_COLOR} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#purpleGlow)" />
        </Svg>
      </Animated.View>

      {/* Floating Cyan Orb */}
      <Animated.View style={[styles.cyanContainer, cyanOrbStyle]}>
        <Svg width={CYAN_ORB_SIZE} height={CYAN_ORB_SIZE}>
          <Defs>
            <RadialGradient
              id="cyanGlow"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
            >
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.18} />
              <Stop offset="25%" stopColor="#06B6D4" stopOpacity={0.10} />
              <Stop offset="65%" stopColor="#0891B2" stopOpacity={0.03} />
              <Stop offset="100%" stopColor={BACKGROUND_COLOR} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#cyanGlow)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_COLOR,
    overflow: 'hidden',
  },
  absoluteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_COLOR,
  },
  purpleContainer: {
    position: 'absolute',
    width: PURPLE_ORB_SIZE,
    height: PURPLE_ORB_SIZE,
    top: -PURPLE_ORB_SIZE * 0.35,
    left: -PURPLE_ORB_SIZE * 0.15,
  },
  cyanContainer: {
    position: 'absolute',
    width: CYAN_ORB_SIZE,
    height: CYAN_ORB_SIZE,
    top: -CYAN_ORB_SIZE * 0.2,
    right: -CYAN_ORB_SIZE * 0.25,
  },
});

export default AuroraBackground;
