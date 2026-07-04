import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  FadeInDown,
  ZoomIn,
  FadeIn,
} from 'react-native-reanimated';
import { Lock, CalendarDays } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';
import { type Mood, type MoodRating, MOOD_MAP } from '@/shared/types';
import { WeeklyHistoryHeader } from './WeeklyHistoryHeader';
import { EmptyState } from './EmptyState';

interface WeeklyHistoryCardProps {
  moodEntries: Mood[];
  isLoading?: boolean;
  onCheckIn?: () => void;
}

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MOOD_COLORS: Record<number, string> = {
  1: '#FF453A',
  2: '#FF9F0A',
  3: '#8E8E93',
  4: '#5AC8FA',
  5: '#30D158',
};

export const WeeklyHistoryCard = React.memo(({
  moodEntries,
  isLoading = false,
  onCheckIn,
}: WeeklyHistoryCardProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'7days' | '30days'>('7days');

  const timelineData = useMemo(() => {
    const today = new Date();
    const numDays = activeTab === '7days' ? 7 : 30;
    const data: { moodLevel: number | null; date: Date }[] = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === d.toDateString()
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
      data.push({ moodLevel: latest ? latest.rating : null, date: d });
    }
    return data;
  }, [moodEntries, activeTab]);

  const hasData = useMemo(() => timelineData.some((d) => d.moodLevel !== null), [timelineData]);

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.container}
      >
        <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
          <WeeklyHistoryHeader />
          <View style={styles.skeletonBody}>
            <View style={styles.skeletonRow}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={styles.skeletonDay}>
                  <View style={[styles.skeletonCircle, { backgroundColor: colors.surface.secondary }]} />
                  <View style={[styles.skeletonLabel, { backgroundColor: colors.surface.secondary }]} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
        <WeeklyHistoryHeader />

        {/* Tab Row */}
        <View style={[styles.tabContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderColor: colors.border.default }]}>
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabButton, activeTab === '7days' && { backgroundColor: colors.surface.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }]}
              onPress={() => setActiveTab('7days')}
            >
              <Text style={[styles.tabText, { color: activeTab === '7days' ? colors.text.primary : colors.text.secondary }]}>Week</Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, activeTab === '30days' && { backgroundColor: colors.surface.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }]}
              onPress={() => setActiveTab('30days')}
            >
              <CalendarDays size={12} color={activeTab === '30days' ? colors.text.primary : colors.text.secondary} style={styles.tabIcon} />
              <Text style={[styles.tabText, { color: activeTab === '30days' ? colors.text.primary : colors.text.secondary }]}>Month</Text>
            </Pressable>
          </View>
        </View>

        {!hasData ? (
          <EmptyState onCheckIn={onCheckIn} />
        ) : activeTab === '7days' ? (
          <SevenDayTimeline data={timelineData} isDark={isDark} />
        ) : (
          <ThirtyDayTimeline data={timelineData} isDark={isDark} />
        )}
      </View>
    </Animated.View>
  );
});

WeeklyHistoryCard.displayName = 'WeeklyHistoryCard';

/* ─── 7-Day Instagram-Style Timeline ─── */

function SevenDayTimeline({ data, isDark }: { data: { moodLevel: number | null; date: Date }[]; isDark: boolean }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.timeline}>
      {data.map((item, i) => {
        const rating = item.moodLevel as MoodRating | null;
        const moodInfo = rating ? MOOD_MAP[rating] : null;
        const color = rating ? MOOD_COLORS[rating] : null;
        const isToday = i === data.length - 1;

        return (
          <React.Fragment key={i}>
            <Animated.View
              entering={ZoomIn.delay(i * 50).duration(350).springify().damping(14).stiffness(120)}
              style={styles.dayFrame}
            >
              <Text style={[styles.dayLabel, { color: isToday ? undefined : undefined, opacity: isToday ? 1 : 0.6 }]}>
                {isToday ? 'Now' : DAY_NAMES[item.date.getDay()]}
              </Text>
              {rating ? (
                <View style={[
                  styles.moodPhoto,
                  { backgroundColor: color + '20', borderColor: color + '35' },
                  isToday && { borderColor: color },
                ]}>
                  <Text style={styles.moodEmoji}>{moodInfo?.emoji}</Text>
                </View>
              ) : (
                <View style={[styles.moodPhoto, styles.moodPhotoEmpty, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                  <View style={[styles.emptyDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />
                </View>
              )}
            </Animated.View>
            {i < data.length - 1 && (
              <View style={[styles.connector, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]} />
            )}
          </React.Fragment>
        );
      })}
    </Animated.View>
  );
}

/* ─── 30-Day Grid Timeline ─── */

function ThirtyDayTimeline({ data, isDark }: { data: { moodLevel: number | null; date: Date }[]; isDark: boolean }) {
  const COLUMNS = 7;
  const rows: { moodLevel: number | null; date: Date }[][] = [];
  for (let i = 0; i < data.length; i += COLUMNS) {
    rows.push(data.slice(i, i + COLUMNS));
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.gridContainer}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((item, ci) => {
            const rating = item.moodLevel;
            const color = rating ? MOOD_COLORS[rating] : null;

            return (
              <Animated.View
                key={ci}
                entering={ZoomIn.delay((ri * COLUMNS + ci) * 15).duration(250).springify().damping(16)}
                style={styles.gridCell}
              >
                {rating ? (
                  <View style={[styles.gridDot, { backgroundColor: color }]} />
                ) : (
                  <View style={[styles.gridDotEmpty, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
                )}
              </Animated.View>
            );
          })}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  card: {
    borderRadius: borderRadius['2xl'] + 2,
    borderWidth: 1,
    padding: spacing.lg + 2,
    overflow: 'hidden',
  },

  /* ─── Tabs ─── */
  tabContainer: {
    borderRadius: borderRadius.md + 2,
    borderWidth: 1,
    padding: 3,
    marginBottom: spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm + 2,
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tabIcon: {
    marginRight: 2,
  },

  /* ─── 7-Day Timeline ─── */
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dayFrame: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  moodPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  moodPhotoEmpty: {
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },
  moodEmoji: {
    fontSize: 18,
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connector: {
    width: 1,
    height: 12,
    marginBottom: 20,
    alignSelf: 'flex-end',
    flexShrink: 0,
  },

  /* ─── 30-Day Grid ─── */
  gridContainer: {
    paddingVertical: spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gridCell: {
    width: 32,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  gridDotEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },

  /* ─── Skeleton ─── */
  skeletonBody: {
    paddingVertical: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonDay: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonLabel: {
    width: 20,
    height: 7,
    borderRadius: 2,
  },
});

export default WeeklyHistoryCard;
