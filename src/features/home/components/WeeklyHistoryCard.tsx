// src/features/home/components/WeeklyHistoryCard.tsx
//
// Compact mood timeline card — premium, optimized edition.
// - Soft animated ambient glow behind the card
// - Gradient-bordered glass surface
// - Shimmer sweep across the chart line (filled state)
// - Glowing "now" dot + refined average pill
// - Empty state keeps the icon + calm pulse/orbit motion (icon untouched)
// - MoodTimeline SVG chart above the 7 emoji dots

import React, { useMemo, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useTheme } from '@/hooks/useTheme';

// FaSeedling (react-icons/fa6) — rendered via react-native-svg so it works on
// both web and native (raw react-icons glyphs crash on native).
const FA_SEEDLING_PATH =
  'M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z';

import { type Mood, type MoodRating, getMoodEmotion } from '@/shared/types';
import { EmotionAvatar } from '@/components/emotion/EmotionAvatar';
import { MoodTimeline } from './MoodTimeline';

interface WeeklyHistoryCardProps {
  moodEntries: Mood[];
  onCheckIn?: () => void;
  onPress?: () => void;
}

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MOOD_COLORS: Record<number, string> = {
  1: '#FF453A',
  2: '#FF9F0A',
  3: '#8E8E93',
  4: '#5AC8FA',
  5: '#30D158',
};

const SVG_WIDTH = 300;
const SVG_HEIGHT = 56;

export const WeeklyHistoryCard = React.memo(({
  moodEntries,
  onCheckIn,
  onPress,
}: WeeklyHistoryCardProps) => {
  const { colors } = useTheme();

  // Ambient glow pulse (behind card)
  const glowScale = useSharedValue(1);
  // Slow rotating orbit (empty state)
  const orbitRotate = useSharedValue(0);
  // Marching-dash phase + traveling-dot angle for the orbit rings
  const orbitPhase = useSharedValue(0);
  // Shimmer sweep across the chart (filled state)
  const shimmerX = useSharedValue(-SVG_WIDTH);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.96, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    orbitRotate.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 24000, easing: Easing.linear }),
        withTiming(0, { duration: 24000, easing: Easing.linear }),
      ),
      -1,
      false,
    );
    orbitPhase.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        withTiming(0, { duration: 4000, easing: Easing.linear }),
      ),
      -1,
      false,
    );
  }, [glowScale, orbitRotate, orbitPhase]);

  const weekData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === d.toDateString(),
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
      return { moodLevel: latest ? latest.rating : null, date: d };
    });
  }, [moodEntries]);

  const hasData = weekData.some((d) => d.moodLevel !== null);

  // Calculate average and trend comparison
  const { averageMood, trendText, trendColor } = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const currEntries = moodEntries.filter(
      (e) => new Date(e.timestamp) >= sevenDaysAgo && new Date(e.timestamp) <= now,
    );
    const prevEntries = moodEntries.filter(
      (e) => new Date(e.timestamp) >= fourteenDaysAgo && new Date(e.timestamp) < sevenDaysAgo,
    );

    const currAvg = currEntries.length > 0
      ? currEntries.reduce((sum, e) => sum + e.rating, 0) / currEntries.length
      : 0;

    const prevAvg = prevEntries.length > 0
      ? prevEntries.reduce((sum, e) => sum + e.rating, 0) / prevEntries.length
      : 0;

    const avgString = currAvg > 0 ? currAvg.toFixed(1) : '—';

    let trendStr = 'no change';
    let color = colors.text.secondary;
    if (currAvg > 0 && prevAvg > 0) {
      const diff = currAvg - prevAvg;
      const pct = Math.round((diff / prevAvg) * 100);
      if (pct > 0) {
        trendStr = `+${pct}% better`;
        color = colors.success;
      } else if (pct < 0) {
        trendStr = `${pct}% lower`;
        color = colors.danger;
      } else {
        trendStr = 'stable';
      }
    } else if (currAvg > 0) {
      trendStr = 'first week';
    }

    return { averageMood: avgString, trendText: trendStr, trendColor: color };
  }, [moodEntries, colors]);

  // Build SVG points from weekData
  const svgPoints = useMemo(() => {
    const colWidth = SVG_WIDTH / 7;
    return weekData.map((d, i) => {
      const x = colWidth * i + colWidth / 2;
      // Invert: rating 1 = bottom, 5 = top
      const y = d.moodLevel != null
        ? SVG_HEIGHT - 8 - ((d.moodLevel - 1) / 4) * (SVG_HEIGHT - 16)
        : SVG_HEIGHT / 2;
      return { x, y, moodLevel: d.moodLevel };
    });
  }, [weekData]);

  // Shimmer animation only matters when there is a chart to sweep.
  useEffect(() => {
    if (!hasData) return;
    shimmerX.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(SVG_WIDTH, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [hasData, shimmerX]);

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const orbitAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${orbitRotate.value}deg` }],
  }));

  // Marching-dash shimmer on the inner ring (continuous, smooth).
  const orbitDashOffset = useDerivedValue(() => orbitPhase.value * 24);

  // A glowing dot traveling along the outer orbit (radius ~48 in the 110 viewBox).
  const ORBIT_R = 48;
  const dotX = useDerivedValue(
    () => 55 + ORBIT_R * Math.cos((orbitRotate.value * Math.PI) / 180),
  );
  const dotY = useDerivedValue(
    () => 55 + ORBIT_R * Math.sin((orbitRotate.value * Math.PI) / 180),
  );

  const orbitProps = useAnimatedProps(() => ({
    strokeDashoffset: orbitDashOffset.value,
  }));

  const dotProps = useAnimatedProps(() => ({
    cx: dotX.value,
    cy: dotY.value,
  }));

  const shimmerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.wrap}>
      {/* Ambient glow behind the card */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ambientGlow,
          glowAnimStyle,
          { backgroundColor: colors.brand.primary },
        ]}
      />

      {/* Gradient-border shell */}
      <View style={[styles.borderShell, { opacity: 0.9 }]}>
        <Pressable
          onPress={onPress}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.default,
            },
          ]}
        >
          {/* Soft inner gradient + glow so the surface never reads as flat white */}
          <View style={styles.innerGlow} pointerEvents="none">
            <Svg width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="none">
              <Defs>
                <RadialGradient id="cardGlow" cx="78%" cy="0%" r="90%">
                  <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.1} />
                  <Stop offset="55%" stopColor={colors.brand.primary} stopOpacity={0.03} />
                  <Stop offset="100%" stopColor={colors.brand.primary} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="320" height="200" fill="url(#cardGlow)" />
            </Svg>
          </View>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text.primary }]}>Mood History</Text>
              {hasData && (
                <View style={[styles.avgPill, { backgroundColor: `${trendColor}14` }]}>
                  <View style={[styles.avgDot, { backgroundColor: trendColor }]} />
                  <Text style={[styles.avgPillText, { color: trendColor }]}>
                    Avg {averageMood} · {trendText}
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.rangeBadge, { backgroundColor: colors.surface.secondary, borderColor: colors.border.default }]}>
              <Text style={[styles.range, { color: colors.text.secondary }]}>7 days</Text>
            </View>
          </View>

          {hasData ? (
            <>
              {/* Mini chart with shimmer sweep */}
              <View style={styles.chartContainer}>
                {/* Soft radial glow behind the line */}
                <View style={styles.chartGlow} pointerEvents="none">
                  <Svg width="100%" height="100%" viewBox="0 0 300 56" preserveAspectRatio="none">
                    <Defs>
                      <RadialGradient id="lineGlow" cx="50%" cy="60%" r="60%">
                        <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.12} />
                        <Stop offset="100%" stopColor={colors.brand.primary} stopOpacity={0} />
                      </RadialGradient>
                    </Defs>
                    <Rect x="0" y="0" width="300" height="56" fill="url(#lineGlow)" />
                  </Svg>
                </View>
                <MoodTimeline
                  points={svgPoints}
                  svgWidth={SVG_WIDTH}
                  svgHeight={SVG_HEIGHT}
                />
                <View style={styles.shimmerClip} pointerEvents="none">
                  <Animated.View style={[styles.shimmerBar, shimmerAnimStyle]}>
                    <Svg width={70} height={SVG_HEIGHT} viewBox="0 0 70 56">
                      <Defs>
                        <LinearGradient id="shimmerFade" x1="0" y1="0" x2="1" y2="0">
                          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
                          <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.35} />
                          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                        </LinearGradient>
                      </Defs>
                      <Rect x="0" y="0" width="70" height={SVG_HEIGHT} fill="url(#shimmerFade)" />
                    </Svg>
                  </Animated.View>
                </View>
              </View>

              {/* Day dots row */}
              <View style={styles.dotsRow}>
                {weekData.map((item, i) => {
                  const rating = item.moodLevel as MoodRating | null;
                  const isToday = i === 6;
                  const color = rating ? MOOD_COLORS[rating] : null;

                  return (
                    <Animated.View
                      key={i}
                      entering={ZoomIn.delay(i * 35).duration(300).springify().damping(16)}
                      style={styles.dayCol}
                    >
                      <View
                        style={[
                          styles.dot,
                          color
                            ? { backgroundColor: `${color}22`, borderColor: `${color}55` }
                            : { backgroundColor: 'transparent', borderColor: colors.border.default },
                          isToday && color && { borderColor: color, shadowColor: color, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
                        ]}
                      >
                        {rating ? (
                          <EmotionAvatar
                            emotion={getMoodEmotion(rating)}
                            size={22}
                            animated={false}
                            showGlow={false}
                          />
                        ) : (
                          <View style={[styles.emptyDot, { backgroundColor: colors.border.default }]} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.dayLabel,
                          { color: isToday ? colors.text.primary : colors.text.secondary },
                          isToday && styles.dayLabelToday,
                        ]}
                      >
                        {isToday ? 'Now' : DAY_LETTERS[item.date.getDay()]}
                      </Text>
                    </Animated.View>
                  );
                })}
              </View>
            </>
          ) : (
            /* Friendly empty state with illustration */
            <View style={styles.emptyContainer}>
              <View style={styles.illustrationContainer}>
                {/* Pulsing glow background */}
                <Animated.View
                  style={[
                    styles.glowBack,
                    { backgroundColor: colors.brand.primary },
                    glowAnimStyle,
                  ]}
                />

                {/* Rotating Concentric SVG Orbits */}
                <Animated.View style={[styles.orbitWrap, orbitAnimStyle]}>
                  <Svg width={96} height={96} viewBox="0 0 110 110">
                    <Defs>
                      <RadialGradient id="orbitDot" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.9} />
                        <Stop offset="100%" stopColor={colors.brand.primary} stopOpacity={0} />
                      </RadialGradient>
                    </Defs>
                    <AnimatedCircle
                      cx="55"
                      cy="55"
                      r="38"
                      stroke={`${colors.brand.primary}22`}
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4, 4"
                      animatedProps={orbitProps}
                    />
                    <AnimatedCircle
                      cx="55"
                      cy="55"
                      r="48"
                      stroke={`${colors.brand.primary}12`}
                      strokeWidth="1"
                      fill="none"
                      strokeDasharray="8, 6"
                      animatedProps={orbitProps}
                    />
                    {/* Glowing dot traveling along the outer orbit */}
                    <AnimatedCircle r="4" fill="url(#orbitDot)" animatedProps={dotProps} />
                    <AnimatedCircle r="1.6" fill={colors.brand.primary} animatedProps={dotProps} />
                  </Svg>
                </Animated.View>

                {/* Centered central icon badge (same exact icon) */}
                <View
                  style={[
                    styles.emptyIconWrap,
                    { backgroundColor: `${colors.brand.primary}14` },
                  ]}
                >
                  <Svg width={22} height={22} viewBox="0 0 512 512">
                    <Path d={FA_SEEDLING_PATH} fill={colors.brand.primary} />
                  </Svg>
                </View>
              </View>
              <View style={styles.emptyText}>
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                  Your first check-in unlocks
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                  weekly insights.
                </Text>
              </View>
              {onCheckIn && (
                <Pressable
                  onPress={onCheckIn}
                  style={({ pressed }) => [
                    styles.emptyBtn,
                    { backgroundColor: colors.brand.primary },
                    pressed && { opacity: 0.88, transform: [{ scale: 0.96 }] },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.emptyBtnText}>Check in</Text>
                </Pressable>
              )}
            </View>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
});

WeeklyHistoryCard.displayName = 'WeeklyHistoryCard';

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -18,
    left: '10%',
    right: '10%',
    height: 90,
    borderRadius: 45,
    opacity: 0.12,
    ...Platform.select({
      web: { filter: 'blur(20px)' },
      default: {},
    }),
    zIndex: 0,
  },
  borderShell: {
    borderRadius: 18,
    padding: 1.2,
    // Layered gradient-border: a faint brand tint shows through the 1.2px gap
    // around the inner card, giving a premium edge highlight.
    backgroundColor: 'rgba(99, 78, 184, 0.28)',
  },
  card: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 12,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    position: 'relative',
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  avgPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  avgDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  avgPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  rangeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  range: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartContainer: {
    marginHorizontal: -4,
    marginBottom: 4,
    height: SVG_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  chartGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  shimmerClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 70,
    height: SVG_HEIGHT,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 15,
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  dayLabelToday: {
    fontWeight: '700',
  },
  // Friendly empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  illustrationContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 2,
  },
  glowBack: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.08,
  },
  orbitWrap: {
    position: 'absolute',
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  emptyText: {
    alignItems: 'center',
    gap: 2,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 4,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default WeeklyHistoryCard;
