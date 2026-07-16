import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookOpen } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { type MoodRating, MOOD_MAP } from '@/shared/types';
import { spacing, shadows } from '@/core/theme';
import { type TimelineDay } from './MoodTimelineVisual';

const FULL_DAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface WeeklyStoryProps {
  days: TimelineDay[];
  weekLabel?: string;
}

/**
 * Arc heuristic (all data-driven from `weekTimelineDays`):
 *  1. Mark days that have a mood rating. With none → "Log a few check-ins…".
 *     With exactly one → single-day acknowledgement.
 *  2. Find the lowest-rated and highest-rated logged days.
 *     If their ratings are equal → "A steady, even week…" (flat fallback).
 *  3. If the peak comes AFTER the dip (rebound), narrate the climb and,
 *     when a reflection or meditation appears between the dip and the peak,
 *     attribute the recovery causally ("Journaling and meditation helped").
 *     If the mood faded after a strong start (decline), narrate that instead
 *     and gently suggest support.
 */
function buildStory(days: TimelineDay[]): { text: string; tone: 'empty' | 'single' | 'flat' | 'rebound' | 'decline' } {
  const rated = days
    .map((d, i) => ({ day: d, i }))
    .filter((x) => x.day.rating != null) as Array<{ day: TimelineDay; i: number; rating: MoodRating }>;

  if (rated.length === 0) {
    return { text: 'Log a few check-ins to start seeing your week’s story.', tone: 'empty' };
  }

  if (rated.length === 1) {
    const { day } = rated[0];
    const label = MOOD_MAP[day.rating as MoodRating].label;
    const emoji = MOOD_MAP[day.rating as MoodRating].emoji;
    return {
      text: `On ${FULL_DAY[day.date.getDay()]} you felt ${emoji} ${label}. A few more check-ins will reveal your fuller story.`,
      tone: 'single',
    };
  }

  let low = rated[0];
  let high = rated[0];
  for (const r of rated) {
    if (r.rating < low.rating) low = r;
    if (r.rating > high.rating) high = r;
  }

  const lowLabel = MOOD_MAP[low.rating].label;
  const lowEmoji = MOOD_MAP[low.rating].emoji;
  const highLabel = MOOD_MAP[high.rating].label;
  const highEmoji = MOOD_MAP[high.rating].emoji;
  const lowDay = FULL_DAY[low.day.date.getDay()];
  const highDay = FULL_DAY[high.day.date.getDay()];

  if (low.rating === high.rating) {
    return {
      text: `A steady, even week — consistent from start to finish, hovering around ${lowEmoji} ${lowLabel}.`,
      tone: 'flat',
    };
  }

  // Did reflection/meditation appear between the dip and the peak?
  const lo = Math.min(low.i, high.i);
  const hi = Math.max(low.i, high.i);
  const support = rated.some(
    (r) =>
      r.i > lo &&
      r.i <= hi &&
      (r.day.meditationDone || (r.day.note != null && r.day.note.trim().length > 0)),
  );

  if (high.i > low.i) {
    let text = `After dipping to ${lowEmoji} ${lowLabel} on ${lowDay}, you climbed back to ${highEmoji} ${highLabel} by ${highDay}.`;
    if (support) text += ' Journaling and meditation seemed to help.';
    return { text, tone: 'rebound' };
  }

  let text = `After a high of ${highEmoji} ${highLabel} on ${highDay}, the week eased down to ${lowEmoji} ${lowLabel} by ${lowDay}.`;
  if (support) text += ' A little journaling or meditation might help steady things.';
  return { text, tone: 'decline' };
}

export const WeeklyStory = React.memo(function WeeklyStory({ days, weekLabel }: WeeklyStoryProps) {
  const { colors } = useTheme();
  const { text, tone } = useMemo(() => buildStory(days), [days]);

  return (
    <Animated.View
      entering={FadeInDown.duration(360)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface.secondary,
          borderColor: colors.border.default,
        },
        shadows.glass,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.brand.primary}18` }]}>
          <BookOpen size={16} color={colors.brand.primary} />
        </View>
        <Text style={[styles.kicker, { color: colors.text.secondary }]}>
          {weekLabel ? weekLabel : 'Your week in words'}
        </Text>
      </View>

      <Text style={[styles.story, { color: colors.text.primary }]}>{text}</Text>

      {tone === 'empty' ? (
        <Text style={[styles.hint, { color: colors.text.tertiary }]}>
          Tap any day on the timeline below to add a check-in.
        </Text>
      ) : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  story: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25,
    letterSpacing: -0.1,
  },
  hint: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});

export default WeeklyStory;
