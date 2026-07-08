// src/features/home/components/HeroCard.tsx
//
// The primary hero card at the top of the Home narrative.
// Large gradient background, no border — the visual anchor of the screen.
// Animates in with FadeIn on mount.

import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import type { NarrativeMoment } from '@/features/home/services/HomeViewModel';
import { getHeroGradient, buildStreakLabel } from '@/features/home/utils/adaptiveContext';

interface HeroCardProps {
  headline: string;
  subline: string;
  ctaLabel: string;
  streak: number;
  dayCount: number;
  moment: NarrativeMoment;
  hasCheckedInToday: boolean;
  onCtaPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeroCard({
  headline,
  subline,
  ctaLabel,
  streak,
  dayCount,
  moment,
  hasCheckedInToday,
  onCtaPress,
}: HeroCardProps) {
  const gradient = getHeroGradient(moment);
  const streakLabel = buildStreakLabel(streak);

  // Gentle pulse on CTA when user hasn't checked in today
  const ctaScale = useSharedValue(1);

  useEffect(() => {
    if (!hasCheckedInToday) {
      ctaScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    } else {
      ctaScale.value = withTiming(1);
    }
  }, [hasCheckedInToday, ctaScale]);

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Day / streak badge */}
        {streakLabel && (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{streakLabel}</Text>
          </Animated.View>
        )}

        {/* Headline */}
        <Animated.Text
          entering={FadeInDown.delay(150).duration(500)}
          style={styles.headline}
        >
          {headline}
        </Animated.Text>

        {/* Subline */}
        <Animated.Text
          entering={FadeInDown.delay(220).duration(500)}
          style={styles.subline}
        >
          {subline}
        </Animated.Text>

        {/* CTA */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={ctaStyle}
        >
          <Pressable
            onPress={onCtaPress}
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
        </Animated.View>

        {/* Bottom metadata row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {dayCount > 0 ? `Day ${dayCount} on Velness` : 'Welcome to Velness'}
          </Text>
          {streak > 0 && (
            <Text style={styles.metaStreak}>🔥 {streak} day streak</Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 12,
  },
  gradient: {
    padding: 24,
    paddingBottom: 20,
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '400',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  metaStreak: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});

export default HeroCard;
