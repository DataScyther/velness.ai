// src/features/home/components/HeroCard.tsx
//
// HeroCard v2 — The strongest emotional first impression in the app.
//
// Component tree:
//   HeroCard
//   ├── GreetingBadge        (time-of-day emoji kicker, top-left)
//   ├── AmbientAnimation     (HeroAura sun/moon, top-right corner)
//   ├── FloatingParticles    (3 tiny dots drifting slowly)
//   ├── GreetingTitle         (personalized "Good Night, NK")
//   ├── GreetingSubtitle      (contextual subline)
//   ├── Divider               (subtle separator)
//   ├── IntentionSection      (label + bold intention text)
//   └── PrimaryCTA            (full-opacity purple button with arrow →)
//
// Animations (only four):
//   1. Content fades in on mount (staggered FadeInDown)
//   2. Sun/moon rotates continuously (HeroAura's built-in)
//   3. Particles drift slowly (translate loops)
//   4. CTA scales to 0.97 on press (spring)

import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import type { NarrativeMoment } from '@/features/home/services/HomeViewModel';
import {
  getHeroGradient,
  buildStreakLabel,
  getTimeOfDay,
} from '@/features/home/utils/adaptiveContext';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';
import { HeroAura, getTimeOfDayKicker } from './HeroAura';
import type { MoodRating } from '@/shared/types';
import { getMoodEmotion } from '@/shared/types';
import { EmotionAvatar } from '@/components/emotion/EmotionAvatar';

const MOOD_PHRASE: Record<MoodRating, string> = {
  5: "Radiant today",
  4: "Feeling solid",
  3: "Steady ground",
  2: "Holding on",
  1: "Tough stretch",
};

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_RADIUS = borderRadius['2xl'];
const ORB = SCREEN_W * 0.60;

// Airy, on-brand light gradient (white → faint violet) — never a dark overlay.
const LIGHT_GRADIENT: [string, string, string] = ['#FFFFFF', '#F6F4FE', '#ECE7FB'];

// ── Floating Particles ──────────────────────────────────────────────────────
// Three tiny dots that drift slowly across the card surface behind the aura.
// Each has its own timing so the motion looks organic, not mechanical.

interface ParticleConfig {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  duration: number;
  opacity: number;
  color: string;
}

const PARTICLES: ParticleConfig[] = [
  { x: SCREEN_W * 0.65, y: 30, dx: 18, dy: -12, radius: 2.5, duration: 22000, opacity: 0.25, color: '#8B5CF6' },
  { x: SCREEN_W * 0.50, y: 55, dx: -14, dy: 10, radius: 2.0, duration: 26000, opacity: 0.18, color: '#06B6D4' },
  { x: SCREEN_W * 0.72, y: 70, dx: 12, dy: -16, radius: 1.8, duration: 30000, opacity: 0.22, color: '#A78BFA' },
];

function Particle({ config, isDark }: { config: ParticleConfig; isDark: boolean }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    const ease = Easing.inOut(Easing.ease);
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: config.duration, easing: ease }),
        withTiming(0, { duration: config.duration, easing: ease }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, [reduced]);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: config.x + t.value * config.dx,
    top: config.y + t.value * config.dy,
    width: config.radius * 2,
    height: config.radius * 2,
    borderRadius: config.radius,
    backgroundColor: config.color,
    opacity: config.opacity * (isDark ? 1 : 0.5),
  }));

  return <Animated.View style={animStyle} />;
}

function FloatingParticles({ isDark }: { isDark: boolean }) {
  return (
    <>
      {PARTICLES.map((config, i) => (
        <Particle key={i} config={config} isDark={isDark} />
      ))}
    </>
  );
}

// ── HeroCard ────────────────────────────────────────────────────────────────

interface HeroCardProps {
  headline: string;
  subline: string;
  streak: number;
  dayCount: number;
  moment: NarrativeMoment;
  hasCheckedInToday: boolean;
  todayMoodRating?: MoodRating | null;
  intention?: string;
  onCheckIn?: () => void;
}

export function HeroCard({
  headline,
  subline,
  streak,
  dayCount,
  moment,
  hasCheckedInToday,
  todayMoodRating = null,
  intention,
  onCheckIn,
}: HeroCardProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const gradient = isDark ? getHeroGradient(moment) : LIGHT_GRADIENT;

  // Defensive brand colors: never crash (colors.brand may be undefined in some
  // theme configs) and never render white-on-white. Explicit purple + white.
  const brandPrimary = colors?.brand?.primary ?? '#634EB8';
  const brandBorder = colors?.brand?.border ?? 'rgba(99, 78, 184, 0.45)';
  const onBrandText = colors?.text?.onBrand ?? '#FFFFFF';
  const label = buildStreakLabel(streak);
  const timeOfDay = getTimeOfDay();
  const kicker = getTimeOfDayKicker(timeOfDay);

  // Faint ambient glows in light mode so they don't read as stains.
  const glowScale = isDark ? 1 : 0.35;

  // ── Continuous aurora drift (smooth, 25s loop using Easing.linear for curves) ──
  const t = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      t.value = 0.5;
      return;
    }
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 25000, easing: Easing.linear }),
        withTiming(0, { duration: 1 }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, [t, reduced]);

  const purpleStyle = useAnimatedStyle(() => {
    // Curved Lissajous orbital path
    const angle = t.value * Math.PI * 2;
    const tx = 30 + Math.cos(angle) * 35;
    const ty = -15 + Math.sin(angle) * 20;
    const s = 0.95 + Math.sin(angle) * 0.08;
    return ({
      transform: [{ translateX: tx }, { translateY: ty }, { scale: s }],
      opacity: (0.13 + Math.cos(angle) * 0.04) * glowScale,
    } as any);
  });
  const cyanStyle = useAnimatedStyle(() => {
    // Opposite curved path for organic overlap
    const angle = t.value * Math.PI * 2;
    const tx = -30 - Math.sin(angle) * 25;
    const ty = -8 + Math.cos(angle) * 25;
    const s = 1.02 - Math.cos(angle) * 0.08;
    return ({
      transform: [{ translateX: tx }, { translateY: ty }, { scale: s }],
      opacity: (0.09 + Math.sin(angle) * 0.03) * glowScale,
    } as any);
  });

  // Slate-based colors for editorial light mode, default tokens for dark mode
  const kickerColor = isDark ? colors.text.secondary : '#475569';
  const titleColor = isDark ? colors.text.primary : '#0f172a'; // Deep slate
  const subtitleColor = isDark ? colors.text.secondary : '#334155'; // Mid slate
  const eyebrowColor = isDark ? colors.text.tertiary : '#64748b';
  const intentionTextColor = isDark ? colors.text.primary : '#1e293b';

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.wrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface.primary,
            borderColor: colors.border.default,
            shadowColor: colors.brand.primary,
          },
        ]}
      >
        {/* ── Background layers (clipped to card) ─────────────────────────── */}
        <View style={[StyleSheet.absoluteFill, { borderRadius: CARD_RADIUS, overflow: 'hidden', zIndex: 0 }]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientTint, { opacity: isDark ? 0.42 : 0.6 }]}
          />

          <Animated.View style={[styles.orbPurple, purpleStyle]}>
            <Svg width={ORB} height={ORB}>
              <Defs>
                <RadialGradient id="heroPurple" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.14} />
                  <Stop offset="35%" stopColor="#7C3AED" stopOpacity={0.06} />
                  <Stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#heroPurple)" />
            </Svg>
          </Animated.View>

          <Animated.View style={[styles.orbCyan, cyanStyle]}>
            <Svg width={ORB} height={ORB}>
              <Defs>
                <RadialGradient id="heroCyan" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.10} />
                  <Stop offset="30%" stopColor="#0891B2" stopOpacity={0.04} />
                  <Stop offset="100%" stopColor="#0891B2" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#heroCyan)" />
            </Svg>
          </Animated.View>

          <FloatingParticles isDark={isDark} />

          {/* Time-of-day focal illustration, tucked into the top-right corner */}
          <View style={styles.auraWrap} pointerEvents="none">
            <HeroAura timeOfDay={timeOfDay} size={isDark ? 104 : 96} />
          </View>
        </View>

        {/* Top inner highlight (glass sheen) */}
        <View style={[styles.sheen, { borderColor: colors.border.strong, zIndex: 0 }]} pointerEvents="none" />

        {/* ── Foreground content ──────────────────────────────────────────── */}
        <View style={[styles.content, { position: 'relative', zIndex: 2 }]}>
          {label ? (
            <Animated.View
              entering={FadeInDown.delay(80).duration(400)}
              style={[styles.badge, { backgroundColor: colors.surface.tertiary }]}
            >
              <Text style={[styles.badgeText, { color: colors.text.secondary }]}>{label}</Text>
            </Animated.View>
          ) : (
            <Animated.Text
              entering={FadeInDown.delay(80).duration(400)}
              style={[styles.kicker, { color: colors.text.secondary }]}
            >
              {kicker}
            </Animated.Text>
          )}

          {!label && <View style={styles.kickerSpacer} />}

          <Animated.Text
            entering={FadeInDown.delay(140).duration(500)}
            style={[styles.headline, { color: colors.text.primary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {headline}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(200).duration(500)}
            style={[styles.subline, { color: colors.text.secondary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {subline}
          </Animated.Text>

          {onCheckIn && (
            <View style={[styles.checkInSlot, { zIndex: 3 }]}>
              <Pressable
                onPress={onCheckIn}
                accessibilityRole="button"
                accessibilityLabel="Check in now"
                style={({ pressed }) => [
                  styles.checkInBtn,
                  {
                    backgroundColor: brandPrimary,
                    borderColor: brandBorder,
                  },
                  pressed && styles.checkInBtnPressed,
                ]}
              >
                <Text style={[styles.checkInText, { color: onBrandText }]}>
                  Check in now
                </Text>
              </Pressable>
            </View>
          )}

          {intention ? (
            <Animated.View
              entering={FadeInDown.delay(240).duration(500)}
              style={styles.intentionContainer}
            >
              <View style={[styles.divider, { backgroundColor: colors.border.default }]} />
              <Text style={[styles.intentionEyebrow, { color: colors.text.tertiary }]}>
                Today's Intention
              </Text>
              <Text
                style={[styles.intentionText, { color: colors.text.primary }]}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {intention}
              </Text>
            </Animated.View>
          ) : null}

          {todayMoodRating && (
            <View style={styles.moodStatusRow}>
              <EmotionAvatar emotion={getMoodEmotion(todayMoodRating)} size={28} animated />
              <Text style={[styles.moodStatusText, { color: colors.text.secondary }]}>
                {MOOD_PHRASE[todayMoodRating]}
              </Text>
            </View>
          )}

          <Animated.View entering={FadeInDown.delay(340).duration(500)} style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
              {dayCount > 0 ? `Day ${dayCount}` : 'Welcome'}
            </Text>
            {streak > 0 && (
              <View style={[styles.streakPill, { backgroundColor: colors.surface.tertiary }]}>
                <Text style={[styles.streakText, { color: colors.text.secondary }]}>
                  {streak} day streak
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
  },
  card: {
    borderRadius: CARD_RADIUS,
    borderWidth: 0.5,
    overflow: 'hidden',
    // Slightly stronger elevation
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  gradientTint: {
    ...StyleSheet.absoluteFillObject,
  },
  orbPurple: {
    position: 'absolute',
    width: ORB,
    height: ORB,
    top: -ORB * 0.34,
    left: -ORB * 0.2,
  },
  orbCyan: {
    position: 'absolute',
    width: ORB,
    height: ORB,
    top: -ORB * 0.22,
    right: -ORB * 0.24,
  },
  auraWrap: {
    position: 'absolute',
    top: -8,
    right: 2,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    opacity: 0.2,
  },
  content: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    minHeight: 200,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  kickerRow: {
    marginBottom: spacing.xs,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  kickerSpacer: {
    height: spacing.sm,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  subline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  // ── Intention ────────────────────────────────────────────────────────────
  intentionContainer: {
    marginBottom: spacing.sm,
    gap: 3,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.18,
    marginVertical: spacing.sm,
  },
  intentionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    letterSpacing: -0.1,
  },
  // ── Mood Status (post check-in) ────────────────────────────────────────
  // Full-width row with content pinned to the left edge so the avatar + phrase
  // align with the greeting above (no stray indent from flex-start sizing).
  moodStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginLeft: -6, // small left shift for the post-check-in phrase
  },
  moodStatusText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  // ── Check-in CTA (between greeting and intention) ──────────────────────
  checkInSlot: {
    marginTop: spacing.sm + 2,
    alignSelf: 'flex-start',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    opacity: 1,
    backgroundColor: '#634EB8',
    borderColor: 'rgba(99, 78, 184, 0.35)',
    shadowColor: '#634EB8',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkInBtnPressed: {
    opacity: 0.9,
  },
  checkInText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  // ── Meta ─────────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  streakPill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default HeroCard;
