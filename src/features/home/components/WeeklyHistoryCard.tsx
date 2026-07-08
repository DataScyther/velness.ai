// src/features/home/components/WeeklyHistoryCard.tsx
//
// Compact mood timeline card — ~40% shorter than the previous version.
// - 7 emoji dots in a single row (no large circles)
// - Inline empty state (2 lines + CTA, no full-height blank area)
// - Removed tab toggle (moved to a future detail view)
// - MoodTimeline SVG chart above the dots

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { type Mood, type MoodRating, MOOD_MAP } from '@/shared/types';
import { MoodTimeline } from './MoodTimeline';

interface WeeklyHistoryCardProps {
  moodEntries: Mood[];
  onCheckIn?: () => void;
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
}: WeeklyHistoryCardProps) => {
  const { colors } = useTheme();

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

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface.primary, borderColor: colors.border.default },
        ]}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Mood History</Text>
          <Text style={[styles.range, { color: colors.text.secondary }]}>7 days</Text>
        </View>

        {hasData ? (
          <>
            {/* Mini chart */}
            <View style={styles.chartContainer}>
              <MoodTimeline
                points={svgPoints}
                svgWidth={SVG_WIDTH}
                svgHeight={SVG_HEIGHT}
              />
            </View>

            {/* Day dots row */}
            <View style={styles.dotsRow}>
              {weekData.map((item, i) => {
                const rating = item.moodLevel as MoodRating | null;
                const isToday = i === 6;
                const color = rating ? MOOD_COLORS[rating] : null;
                const emoji = rating ? MOOD_MAP[rating].emoji : null;

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
                          ? { backgroundColor: `${color}22`, borderColor: `${color}44` }
                          : { backgroundColor: 'transparent', borderColor: colors.border.default },
                        isToday && color && { borderColor: color },
                      ]}
                    >
                      {emoji ? (
                        <Text style={styles.emoji}>{emoji}</Text>
                      ) : (
                        <View style={[styles.emptyDot, { backgroundColor: colors.border.default }]} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.dayLabel,
                        { color: isToday ? colors.brand.primary : colors.text.secondary },
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
          /* Compact empty state */
          <View style={styles.emptyRow}>
            <View style={styles.emptyText}>
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No entries yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                Complete today's check-in to start your mood history
              </Text>
            </View>
            {onCheckIn && (
              <Pressable
                onPress={onCheckIn}
                style={[styles.emptyBtn, { backgroundColor: colors.brand.primary }]}
                accessibilityRole="button"
              >
                <Text style={styles.emptyBtnText}>Check in</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
});

WeeklyHistoryCard.displayName = 'WeeklyHistoryCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  range: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    marginHorizontal: -4,
    marginBottom: 6,
    // Fixed height matching SVG_HEIGHT
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
  // Compact inline empty state
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  emptyText: {
    flex: 1,
    gap: 3,
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
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default WeeklyHistoryCard;
