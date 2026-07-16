import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { type Mood, type MoodRating, MOOD_MAP } from '@/shared/types';
import { spacing, shadows } from '@/core/theme';

const { width: SCREEN_W } = Dimensions.get('window');

const MOOD_COLORS: Record<number, string> = {
  1: '#FF453A', // Awful (Red)
  2: '#FF9F0A', // Not Good (Orange)
  3: '#8E8E93', // Okay (Gray)
  4: '#5AC8FA', // Good (Blue)
  5: '#30D158', // Great (Green)
};

const WEEK_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface MoodCalendarProps {
  moodEntries: Mood[];
}

interface CalendarCell {
  date: Date | null;
  dayNumber: number | null;
  rating: MoodRating | null;
  /** previous calendar day (date − 1) is also checked-in AND in the same week row */
  streakLeft: boolean;
  /** next calendar day (date + 1) is also checked-in AND in the same week row */
  streakRight: boolean;
}

const CELL_HEIGHT = 46;

export const MoodCalendar = React.memo(function MoodCalendar({
  moodEntries,
}: MoodCalendarProps) {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const cellSize = (SCREEN_W - 64) / 7;

  const cells = useMemo<CalendarCell[]>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const checkedByDay = new Map<string, MoodRating>();
    for (const entry of moodEntries) {
      const d = new Date(entry.timestamp);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = new Date(year, month, d.getDate()).toDateString();
        checkedByDay.set(key, entry.rating);
      }
    }

    const result: CalendarCell[] = [];

    // Leading blanks before the 1st of the month.
    for (let i = 0; i < firstDayIndex; i++) {
      result.push({ date: null, dayNumber: null, rating: null, streakLeft: false, streakRight: false });
    }

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(year, month, day);
      const key = cellDate.toDateString();
      const rating = checkedByDay.has(key) ? checkedByDay.get(key)! : null;
      result.push({
        date: cellDate,
        dayNumber: day,
        rating,
        streakLeft: false,
        streakRight: false,
      });
    }

    // Streak connection rule: connect two adjacent calendar days only when
    // BOTH are checked-in AND they sit in the same week row (Sunday-first).
    // A week-row break happens between Saturday (6) and Sunday (0), so two
    // adjacent days D-1 and D share a row iff D is NOT Sunday. We therefore
    // set streakLeft when the previous cell is checked-in and the current
    // cell's weekday !== 0, and streakRight when the next cell is checked-in
    // and the current cell's weekday !== 6.
    for (let i = 0; i < result.length; i++) {
      const cell = result[i];
      if (cell.date == null || cell.rating == null) continue;
      const weekday = cell.date.getDay();

      const prev = result[i - 1];
      if (prev && prev.date != null && prev.rating != null && weekday !== 0) {
        cell.streakLeft = true;
        prev.streakRight = true;
      }
    }

    return result;
  }, [moodEntries]);

  const handleSelect = useCallback((date: Date) => {
    setSelectedDate((prev) =>
      prev != null && prev.toDateString() === date.toDateString() ? null : date
    );
  }, []);

  const subtitle = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface.primary, borderColor: colors.border.default },
        shadows.glass,
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Mood Calendar
      </Text>
      <Text style={[styles.calendarSubtitle, { color: colors.text.secondary }]}>
        {subtitle}
      </Text>

      <View style={styles.calendarGrid}>
        <View style={styles.calendarWeekHeader}>
          {WEEK_LABELS.map((day) => (
            <Text
              key={day}
              style={[styles.calendarWeekText, { color: colors.text.tertiary, width: cellSize }]}
            >
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarBody}>
          {cells.map((cell, idx) => {
            if (cell.date == null) {
              return (
                <View key={idx} style={[styles.calendarCell, { width: cellSize, height: CELL_HEIGHT }]}>
                  <View style={styles.calendarCellPlaceholder} />
                </View>
              );
            }
            const isSelected =
              selectedDate != null &&
              selectedDate.toDateString() === cell.date.toDateString();
            return (
              <CalendarDayCell
                key={idx}
                cell={cell}
                cellSize={cellSize}
                selected={isSelected}
                onSelect={handleSelect}
              />
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {([1, 2, 3, 4, 5] as MoodRating[]).map((rating) => (
          <View key={rating} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MOOD_COLORS[rating] }]} />
            <Text style={[styles.legendLabel, { color: colors.text.secondary }]}>
              {MOOD_MAP[rating].label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

interface CalendarDayCellProps {
  cell: CalendarCell;
  cellSize: number;
  selected: boolean;
  onSelect: (date: Date) => void;
}

function CalendarDayCell({ cell, cellSize, selected, onSelect }: CalendarDayCellProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.12 : 1, {
      damping: 14,
      stiffness: 200,
    });
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotSize = 28;
  const moodColor = cell.rating != null ? MOOD_COLORS[cell.rating] : null;
  const glowColor = moodColor ?? colors.brand.primary;

  const dateLabel = cell.date
    ? `${cell.date.toLocaleDateString('default', { weekday: 'long' })} ${
        cell.dayNumber
      }, mood ${cell.rating != null ? MOOD_MAP[cell.rating].label : 'not logged'}`
    : 'empty';

  const connector = { position: 'absolute' as const, top: CELL_HEIGHT / 2 - 2, height: 4, backgroundColor: glowColor, opacity: 0.55, borderRadius: 2 };

  return (
    <Pressable
      onPress={() => onSelect(cell.date as Date)}
      accessibilityRole="button"
      accessibilityLabel={dateLabel}
      style={[styles.calendarCell, { width: cellSize, height: CELL_HEIGHT }]}
    >
      {cell.streakLeft ? (
        <View style={[connector, { left: 0, width: cellSize / 2 }]} />
      ) : null}
      {cell.streakRight ? (
        <View style={[connector, { right: 0, width: cellSize / 2 }]} />
      ) : null}

      <Animated.View
        style={[
          styles.calendarDot,
          { width: dotSize, height: dotSize },
          cell.rating != null
            ? { backgroundColor: moodColor }
            : {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.border.default,
              },
          selected && {
            shadowColor: glowColor,
            shadowOpacity: 0.5,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.calendarDayNum,
            { color: cell.rating != null ? '#FFFFFF' : colors.text.tertiary },
          ]}
        >
          {cell.dayNumber}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  calendarSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  calendarGrid: {
    alignSelf: 'stretch',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  calendarWeekText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarCellPlaceholder: {
    width: 28,
    height: 28,
  },
  calendarDot: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MoodCalendar;
