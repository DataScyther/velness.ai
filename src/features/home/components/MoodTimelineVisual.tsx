import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Moon, Wind, BookOpen } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { type MoodRating, MOOD_MAP } from '@/shared/types';
import { spacing, borderRadius, shadows } from '@/core/theme';

const MOOD_COLORS: Record<number, string> = {
  1: '#FF453A', // Awful (Red)
  2: '#FF9F0A', // Not Good (Orange)
  3: '#8E8E93', // Okay (Gray)
  4: '#5AC8FA', // Good (Blue)
  5: '#30D158', // Great (Green)
};

const FULL_DAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const NODE_SIZE = 56;

export interface TimelineDay {
  dayName: string;
  date: Date;
  rating: MoodRating | null;
  note: string | null;
  meditationDone: boolean;
  sleepText: string | null;
}

export interface MoodTimelineVisualProps {
  days: TimelineDay[];
  weekLabel?: string;
}

export const MoodTimelineVisual = React.memo(function MoodTimelineVisual({
  days,
  weekLabel,
}: MoodTimelineVisualProps) {
  const { colors } = useTheme();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const expanded = expandedIndex != null ? days[expandedIndex] : null;

  // Emotional arc: color the connecting line by each day's mood so the line
  // itself reads as the week's feeling. Untracked days fall back to the border
  // tone so the arc stays continuous.
  const arc = useMemo(() => {
    const colorsArr = days.map((d) =>
      d.rating != null ? MOOD_COLORS[d.rating] : '#8A8A8E',
    ) as unknown as readonly [string, string, ...string[]];
    const locations = days.map((_, i) =>
      days.length > 1 ? i / (days.length - 1) : 0,
    ) as unknown as readonly [number, number, ...number[]];
    return { colors: colorsArr, locations };
  }, [days]);

  // Subtle highlight on the worst→best transition: the first day after the
  // lowest-rated day whose mood turns upward (the turning point of the story).
  const recoveryIndex = useMemo(() => {
    let minRating = Infinity;
    let minIndex = -1;
    days.forEach((d, i) => {
      if (d.rating != null && d.rating < minRating) {
        minRating = d.rating;
        minIndex = i;
      }
    });
    if (minIndex < 0) return -1;
    for (let i = minIndex + 1; i < days.length; i++) {
      if (days[i].rating != null && days[i].rating > minRating) return i;
    }
    return -1;
  }, [days]);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }, shadows.glass]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Mood Timeline</Text>
        {weekLabel ? (
          <Text style={[styles.weekLabel, { color: colors.text.secondary }]}>{weekLabel}</Text>
        ) : null}
      </View>

      <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
        Tap a day to read its story
      </Text>

      {/* Node row with connecting line (emotional arc) behind */}
      <View style={styles.row}>
        <LinearGradient
          colors={arc.colors}
          locations={arc.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.connector, { opacity: 0.85 }]}
        />
        {days.map((day, i) => {
          const isExpanded = expandedIndex === i;
          const nodeColor = day.rating != null ? MOOD_COLORS[day.rating] : colors.surface.secondary;
          const emoji = day.rating != null ? MOOD_MAP[day.rating].emoji : '·';
          return (
            <Pressable
              key={i}
              onPress={() => toggle(i)}
              accessibilityRole="button"
              accessibilityLabel={`${FULL_DAY[day.date.getDay()]} mood ${
                day.rating != null ? MOOD_MAP[day.rating].label : 'not logged'
              }`}
              style={({ pressed }) => [styles.column, pressed && styles.columnPressed]}
            >
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: nodeColor,
                    borderColor: isExpanded ? colors.brand.primary : colors.border.default,
                    shadowColor: day.rating != null ? nodeColor : '#000000',
                  },
                  isExpanded && styles.nodeExpanded,
                  i === recoveryIndex && {
                    borderColor: colors.brand.secondary,
                    borderWidth: 3,
                    shadowColor: colors.brand.secondary,
                    shadowOpacity: 0.5,
                  },
                ]}
              >
                <Text style={styles.nodeEmoji}>{emoji}</Text>
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  { color: isExpanded ? colors.text.primary : colors.text.secondary },
                ]}
              >
                {day.dayName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Expanded detail panel */}
      {expanded ? (
        <Animated.View
          entering={FadeInDown.duration(280).springify()}
          style={[styles.detail, { borderColor: colors.border.default }]}
        >
          <View style={styles.detailTop}>
            <Text style={styles.detailEmoji}>
              {expanded.rating != null ? MOOD_MAP[expanded.rating].emoji : '–'}
            </Text>
            <View style={styles.detailTopText}>
              <Text style={[styles.detailDay, { color: colors.text.primary }]}>
                {FULL_DAY[expanded.date.getDay()]}
              </Text>
              <Text style={[styles.detailMood, { color: colors.text.secondary }]}>
                {expanded.rating != null ? MOOD_MAP[expanded.rating].label : 'No mood logged'}
              </Text>
            </View>
          </View>

          <View style={[styles.subSection, { borderTopColor: colors.border.default }]}>
            <View style={styles.subHeader}>
              <BookOpen size={16} color={colors.brand.secondary} />
              <Text style={[styles.subTitle, { color: colors.text.primary }]}>Story</Text>
            </View>
            <Text style={[styles.subValue, { color: colors.text.secondary }]}>
              {expanded.note && expanded.note.trim().length > 0
                ? `“${expanded.note.trim()}”`
                : 'No reflection'}
            </Text>
          </View>

          <View style={[styles.subSection, { borderTopColor: colors.border.default }]}>
            <View style={styles.subHeader}>
              <Moon size={16} color={colors.brand.secondary} />
              <Text style={[styles.subTitle, { color: colors.text.primary }]}>Sleep</Text>
            </View>
            <Text style={[styles.subValue, { color: colors.text.secondary }]}>
              {expanded.sleepText ?? '—'}
            </Text>
          </View>

          <View style={[styles.subSection, { borderTopColor: colors.border.default }]}>
            <View style={styles.subHeader}>
              <Wind size={16} color={colors.brand.secondary} />
              <Text style={[styles.subTitle, { color: colors.text.primary }]}>Meditation</Text>
            </View>
            <Text
              style={[
                styles.subValue,
                {
                  color: expanded.meditationDone ? colors.success : colors.text.tertiary,
                  fontWeight: '700',
                },
              ]}
            >
              {expanded.meditationDone ? 'Done' : 'Skipped'}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  connector: {
    position: 'absolute',
    top: NODE_SIZE / 2,
    left: '7.14%',
    right: '7.14%',
    height: 3,
    borderRadius: 999,
    opacity: 0.6,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  columnPressed: {
    opacity: 0.7,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  nodeExpanded: {
    borderWidth: 3,
    transform: [{ scale: 1.06 }],
  },
  nodeEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  detailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detailEmoji: {
    fontSize: 40,
  },
  detailTopText: {
    flex: 1,
  },
  detailDay: {
    fontSize: 18,
    fontWeight: '800',
  },
  detailMood: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  subSection: {
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MoodTimelineVisual;
