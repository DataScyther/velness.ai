/**
 * HeroAura — Premium, highly-dynamic time-of-day "aura orb" for the HeroCard.
 *
 * Visual features:
 *   • Morning / Afternoon (Sun):
 *     - Pulsing central glowing core with an inner halo ring
 *     - Dual counter-rotating ray systems (outer long rays clockwise +
 *       inner short rays counter-clockwise), alternating long/short pill rays
 *   • Evening / Night (Moon):
 *     - Glowing crescent moon with a soft outer halo glow
 *     - Gentle bobbing + subtle scale breathing
 *     - Three individual twinkling stars (using independent Reanimated opacity loops)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

import type { TimeOfDay } from '@/features/home/utils/adaptiveContext';

const PALETTE: Record<TimeOfDay, { light: string; dark: string }> = {
  morning: { light: '#FBD36B', dark: '#F59E57' },
  afternoon: { light: '#FCE08A', dark: '#F8A766' },
  evening: { light: '#C9BCFD', dark: '#A78BFA' },
  night: { light: '#8ED6FC', dark: '#67E8F9' },
};

const KICKER: Record<TimeOfDay, string> = {
  morning: '☀ Good Morning',
  afternoon: '☀️ Good Afternoon',
  evening: '🌇 Good Evening',
  night: '🌙 Night',
};

export function getTimeOfDayKicker(timeOfDay: TimeOfDay): string {
  return KICKER[timeOfDay];
}

function isMoon(timeOfDay: TimeOfDay): boolean {
  return timeOfDay === 'evening' || timeOfDay === 'night';
}

interface HeroAuraProps {
  timeOfDay: TimeOfDay;
  size?: number;
}

// ── Twinkling Star Component ────────────────────────────────────────────────
function TwinklingStar({ cx, cy, r, fill, duration, delay, size }: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  duration: number;
  delay: number;
  size: number;
}) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (reduced) {
      opacity.value = 0.85;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.25, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
      // start offset via delay on the first run (no-op on repeat)
    );
    return () => cancelAnimation(opacity);
  }, [reduced, duration]);

  // Independent scale twinkle for a livelier feel
  const scale = useSharedValue(1);
  useEffect(() => {
    if (reduced) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(scale);
  }, [reduced, duration]);

  const starStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, starStyle]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Circle cx={cx} cy={cy} r={r} fill={fill} />
      </Svg>
    </Animated.View>
  );
}

// ── Main HeroAura Component ──────────────────────────────────────────────────
export const HeroAura = React.memo(({ timeOfDay, size = 120 }: HeroAuraProps) => {
  const { light, dark } = PALETTE[timeOfDay];
  const glowId = `auraGlow-${timeOfDay}`;
  const orbId = `auraOrb-${timeOfDay}`;
  const moon = isMoon(timeOfDay);

  // Minimal shared values — reused across animated styles.
  const breathe = useSharedValue(0);     // ambient glow breathing
  const corePulse = useSharedValue(1);   // sun core scale pulse
  const outerRotate = useSharedValue(0); // outer rays, clockwise
  const innerRotate = useSharedValue(0); // inner rays, counter-clockwise
  const moonBob = useSharedValue(0);     // moon bob + breathing (0..1)

  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      breathe.value = 0.5;
      corePulse.value = 1;
      outerRotate.value = 0;
      innerRotate.value = 0;
      moonBob.value = 0.5;
      return;
    }
    const ease = Easing.inOut(Easing.ease);

    // Glow breathe loop
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: ease }),
        withTiming(0, { duration: 4000, easing: ease }),
      ),
      -1,
      true,
    );

    // Core pulsing loop
    corePulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 3000, easing: ease }),
        withTiming(0.94, { duration: 3000, easing: ease }),
      ),
      -1,
      true,
    );

    // Outer rays — slow clockwise rotation
    outerRotate.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 60000, easing: Easing.linear }),
        withTiming(360, { duration: 1 }),
      ),
      -1,
      false,
    );

    // Inner rays — faster counter-clockwise rotation
    innerRotate.value = withRepeat(
      withSequence(
        withTiming(-360, { duration: 38000, easing: Easing.linear }),
        withTiming(-360, { duration: 1 }),
      ),
      -1,
      false,
    );

    // Moon gentle bob + breathing phase
    moonBob.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: ease }),
        withTiming(0, { duration: 5200, easing: ease }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(breathe);
      cancelAnimation(corePulse);
      cancelAnimation(outerRotate);
      cancelAnimation(innerRotate);
      cancelAnimation(moonBob);
    };
  }, [breathe, corePulse, outerRotate, innerRotate, moonBob, reduced]);

  // Glow style
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.30 + breathe.value * 0.22,
    transform: [
      { scale: 0.95 + breathe.value * 0.09 },
    ],
  }));

  // Sun ray rotation styles
  const outerRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRotate.value}deg` }],
  }));
  const innerRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${innerRotate.value}deg` }],
  }));

  // Core pulsing style
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: corePulse.value }],
  }));

  // Moon bob + breathing (derived from a single shared value)
  const moonStyle = useAnimatedStyle(() => {
    const phase = moonBob.value * Math.PI * 2;
    const transform: [{ translateY: number }, { scale: number }] = [
      { translateY: Math.sin(phase) * 3 },
      { scale: 0.98 + (Math.sin(phase) * 0.5 + 0.5) * 0.04 },
    ];
    return { transform };
  });

  // Render one layer of evenly-spaced rounded "pill" rays radiating from the
  // core. `r1` is the inner start radius, `len` the outer tip radius.
  const renderRays = (
    count: number,
    r1: number,
    len: number,
    strokeWidth: number,
    strokeId: string,
    opacity: number,
    angleOffset = 0,
  ) => {
    return Array.from({ length: count }).map((_, i) => {
      const a = (i * Math.PI * 2) / count + angleOffset;
      const x1 = 60 + Math.cos(a) * r1;
      const y1 = 60 + Math.sin(a) * r1;
      const x2 = 60 + Math.cos(a) * len;
      const y2 = 60 + Math.sin(a) * len;
      return (
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={`url(#${strokeId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={opacity}
        />
      );
    });
  };

  return (
    <View style={{ width: size, height: size }}>
      {/* Background glow radial layer - Expanded viewBox to avoid edge clipping */}
      <Animated.View style={[glowStyle, { position: 'absolute', width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="-20 -20 160 160">
          <Defs>
            <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={light} stopOpacity={0.9} />
              <Stop offset="30%" stopColor={light} stopOpacity={0.6} />
              <Stop offset="70%" stopColor={dark} stopOpacity={0.2} />
              <Stop offset="100%" stopColor={dark} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="60" cy="60" r="70" fill={`url(#${glowId})`} />
        </Svg>
      </Animated.View>

      {/* Main Celestial Elements */}
      {moon ? (
        <View style={{ width: size, height: size }}>
          {/* Soft outer halo glow behind the crescent */}
          <Animated.View style={[glowStyle, { position: 'absolute', width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="-20 -20 160 160">
              <Defs>
                <RadialGradient id={`${orbId}-moonGlow`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={light} stopOpacity={0.55} />
                  <Stop offset="45%" stopColor={light} stopOpacity={0.18} />
                  <Stop offset="100%" stopColor={light} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx="60" cy="60" r="52" fill={`url(#${orbId}-moonGlow)`} />
            </Svg>
          </Animated.View>

          {/* Bobbing + breathing crescent moon core */}
          <Animated.View style={[moonStyle, { position: 'absolute', width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 120 120">
              <Defs>
                <LinearGradient id={`${orbId}-moon`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={light} />
                  <Stop offset="100%" stopColor={dark} />
                </LinearGradient>
              </Defs>
              <Path d="M62 24 A36 36 0 1 0 62 96 A28 28 0 1 1 62 24 Z" fill={`url(#${orbId}-moon)`} />
            </Svg>
          </Animated.View>

          {/* Twinkling stars */}
          <TwinklingStar cx={92} cy={30} r={2.8} fill={light} duration={2000} delay={0} size={size} />
          <TwinklingStar cx={102} cy={50} r={1.8} fill={light} duration={2600} delay={300} size={size} />
          <TwinklingStar cx={84} cy={64} r={2.1} fill={light} duration={3200} delay={600} size={size} />
        </View>
      ) : (
        <View style={{ width: size, height: size }}>
          {/* Outer Rays Layer (Clockwise) */}
          <Animated.View style={[outerRotateStyle, { position: 'absolute', width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 120 120">
              <Defs>
                <RadialGradient id={`${orbId}-rays-outer`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={light} stopOpacity={0.95} />
                  <Stop offset="100%" stopColor={dark} stopOpacity={0.35} />
                </RadialGradient>
              </Defs>
              {renderRays(12, 30, 52, 3.5, `${orbId}-rays-outer`, 0.9)}
            </Svg>
          </Animated.View>

          {/* Inner Rays Layer (Counter-clockwise, offset half-step for density) */}
          <Animated.View style={[innerRotateStyle, { position: 'absolute', width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 120 120">
              <Defs>
                <RadialGradient id={`${orbId}-rays-inner`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={light} stopOpacity={0.85} />
                  <Stop offset="100%" stopColor={dark} stopOpacity={0.25} />
                </RadialGradient>
              </Defs>
              {renderRays(12, 28, 42, 2.5, `${orbId}-rays-inner`, 0.8, Math.PI / 12)}
            </Svg>
          </Animated.View>

          {/* Pulsing Sun Core */}
          <Animated.View style={[coreStyle, { position: 'absolute', width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 120 120">
              <Defs>
                <RadialGradient id={`${orbId}-sun-core`} cx="50%" cy="45%" r="60%">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
                  <Stop offset="40%" stopColor={light} stopOpacity={1} />
                  <Stop offset="100%" stopColor={dark} stopOpacity={1} />
                </RadialGradient>
                <RadialGradient id={`${orbId}-core-halo`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={light} stopOpacity={0.45} />
                  <Stop offset="100%" stopColor={light} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx="60" cy="60" r="30" fill={`url(#${orbId}-core-halo)`} />
              <Circle cx="60" cy="60" r="18" fill={`url(#${orbId}-sun-core)`} />
            </Svg>
          </Animated.View>
        </View>
      )}
    </View>
  );
});

HeroAura.displayName = 'HeroAura';

export default HeroAura;
