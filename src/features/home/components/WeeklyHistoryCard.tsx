import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect, RadialGradient } from 'react-native-svg';
import { Smile, Flame, Calendar, Lock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius, shadows } from '@/core/theme';
import type { Mood } from '@/shared/types';
import { WeeklyHistoryHeader } from './WeeklyHistoryHeader';
import { MoodTimeline } from './MoodTimeline';
import { DayLabel } from './DayLabel';
import { InsightLabel } from './InsightLabel';
import { EmptyState } from './EmptyState';

interface WeeklyHistoryCardProps {
  moodEntries: Mood[];
  isLoading?: boolean;
  onCheckIn?: () => void;
}

const GRAPH_HEIGHT = 110;
const GRAPH_PADDING_H = 20;
const CARD_H_PADDING = spacing.lg * 2;

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function generateInsight(points: { moodLevel: number | null }[]): string {
  const valid = points.filter((p) => p.moodLevel !== null).map((p) => p.moodLevel!);
  if (valid.length === 0) return '';

  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((a, b) => a + (b - avg) ** 2, 0) / valid.length;

  if (variance < 0.5) {
    return 'Your mood patterns are showing high stability. Reflect on the habits keeping you balanced.';
  }
  if (avg > 4) {
    return "You've had a highly positive cycle. Keep dedicating time to your self-care practices!";
  }
  if (avg > 3) {
    return "Your week reflects a healthy, balanced state of mindfulness. Stay centered.";
  }
  return "You have navigated several shifts this week. Be gentle with yourself and prioritize quiet reflection.";
}

const CARD_WIDTH = Dimensions.get('window').width - spacing.xl * 2 - CARD_H_PADDING;

export const WeeklyHistoryCard = React.memo(({
  moodEntries,
  isLoading = false,
  onCheckIn,
}: WeeklyHistoryCardProps) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'7days' | '30days'>('7days');

  const timelineData = useMemo(() => {
    const today = new Date();
    const data: { moodLevel: number | null; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === d.toDateString()
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
      data.push({
        moodLevel: latest ? latest.rating : null,
        date: d,
      });
    }
    return data;
  }, [moodEntries]);

  const dynamicDayLabels = useMemo(() => {
    return timelineData.map((item, idx) => {
      if (idx === timelineData.length - 1) return 'TODAY';
      return DAY_NAMES[item.date.getDay()];
    });
  }, [timelineData]);

  const points = useMemo(() => {
    const svgWidth = CARD_WIDTH - GRAPH_PADDING_H * 2;
    const step = svgWidth / 6;
    const topY = GRAPH_PADDING_H;
    const bottomY = GRAPH_HEIGHT - GRAPH_PADDING_H;
    const range = bottomY - topY;

    return timelineData.map((item, idx) => {
      const x = GRAPH_PADDING_H + idx * step;
      const y = item.moodLevel !== null
        ? bottomY - ((item.moodLevel - 1) / 4) * range
        : bottomY;
      return { x, y, moodLevel: item.moodLevel };
    });
  }, [timelineData]);

  const hasData = useMemo(() => timelineData.some((d) => d.moodLevel !== null), [timelineData]);

  const insightText = useMemo(() => generateInsight(points), [points]);

  const stats = useMemo(() => {
    const validLevels = timelineData
      .filter((d) => d.moodLevel !== null)
      .map((d) => d.moodLevel!);

    const loggedCount = validLevels.length;
    
    let avgMood = '-';
    let avgValue = 0;
    if (loggedCount > 0) {
      avgValue = validLevels.reduce((a, b) => a + b, 0) / loggedCount;
      if (avgValue >= 4.5) avgMood = 'Excellent';
      else if (avgValue >= 3.8) avgMood = 'Good';
      else if (avgValue >= 2.8) avgMood = 'Balanced';
      else if (avgValue >= 1.8) avgMood = 'Fair';
      else avgMood = 'Low';
    }

    let streak = 0;
    const reverseTimeline = [...timelineData].reverse();
    const hasTodayOrYesterday = reverseTimeline[0].moodLevel !== null || reverseTimeline[1].moodLevel !== null;
    if (hasTodayOrYesterday) {
      for (const day of reverseTimeline) {
        if (day.moodLevel !== null) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      loggedCount,
      avgMood,
      avgValue: avgValue > 0 ? avgValue.toFixed(1) : '0',
      streak,
      consistency: Math.round((loggedCount / 7) * 100),
    };
  }, [timelineData]);

  function SkeletonPulse({ children }: { children: React.ReactNode }) {
    const opacity = useSharedValue(0.3);
    useEffect(() => {
      opacity.value = withRepeat(
        withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, [opacity]);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  }

  const BackgroundGlow = () => (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="bgGlowTop" cx="95%" cy="5%" rx="55%" ry="55%">
            <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={colors.brand.secondary || '#8B5CF6'} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="bgGlowBottom" cx="5%" cy="95%" rx="45%" ry="45%">
            <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.05} />
            <Stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGlowTop)" />
        <Rect width="100%" height="100%" fill="url(#bgGlowBottom)" />
      </Svg>
    </View>
  );

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.container}
      >
        <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default, ...shadows.glass }]}>
          <BackgroundGlow />
          
          <View style={styles.accentBar}>
            <Svg width="100%" height={3.5}>
              <Defs>
                <LinearGradient id="skeletonAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
                  <Stop offset="50%" stopColor={colors.brand.primary} />
                  <Stop offset="100%" stopColor="#06B6D4" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height={3.5} fill="url(#skeletonAccentGrad)" />
            </Svg>
          </View>
          <WeeklyHistoryHeader />
          <SkeletonPulse>
            <View style={styles.skeletonTabs} />
            <View style={styles.skeletonStats} />
            <View style={[styles.skeletonTimeline, { height: GRAPH_HEIGHT }]}>
              <View style={styles.skeletonRow}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.skeletonCircle,
                      { backgroundColor: colors.surface.secondary, borderColor: colors.border.default },
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.daysRow}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.skeletonLabel, { backgroundColor: colors.surface.secondary }]}
                />
              ))}
            </View>
            <View style={styles.skeletonGoal} />
          </SkeletonPulse>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default, ...shadows.glass }]}>
        <BackgroundGlow />

        <View style={styles.accentBar}>
          <Svg width="100%" height={3.5}>
            <Defs>
              <LinearGradient id="cardAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
                <Stop offset="50%" stopColor={colors.brand.primary} />
                <Stop offset="100%" stopColor="#06B6D4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height={3.5} fill="url(#cardAccentGrad)" />
          </Svg>
        </View>
        
        <WeeklyHistoryHeader />

        <View style={[styles.tabContainer, { backgroundColor: `${colors.brand.primary}06`, borderColor: colors.border.default }]}>
          <Pressable 
            style={[styles.tabButton, activeTab === '7days' && { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]} 
            onPress={() => setActiveTab('7days')}
          >
            <Text style={[styles.tabText, { color: activeTab === '7days' ? colors.brand.primary : colors.text.secondary }]}>7 Days</Text>
          </Pressable>
          <Pressable 
            style={[styles.tabButton, activeTab === '30days' && { backgroundColor: 'transparent' }]} 
            onPress={() => setActiveTab('7days')}
          >
            <View style={styles.lockRow}>
              <Text style={[styles.tabText, { color: colors.text.secondary, opacity: 0.6 }]}>30 Days</Text>
              <Lock size={10} color={colors.text.secondary} opacity={0.6} style={styles.lockIcon} />
            </View>
          </Pressable>
        </View>

        {!hasData ? (
          <EmptyState onCheckIn={onCheckIn} />
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, { backgroundColor: `${colors.brand.primary}04`, borderColor: colors.border.default }]}>
                <Smile size={13} color={colors.brand.primary} />
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.avgMood}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Avg Mood ({stats.avgValue})</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: `${colors.brand.primary}04`, borderColor: colors.border.default }]}>
                <Flame size={13} color={colors.warning} />
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.streak} Days</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Streak Tracker</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: `${colors.brand.primary}04`, borderColor: colors.border.default }]}>
                <Calendar size={13} color="#00E699" />
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.loggedCount}/7 Days</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Days Checked In</Text>
              </View>
            </View>

            <MoodTimeline
              points={points}
              svgWidth={CARD_WIDTH}
              svgHeight={GRAPH_HEIGHT}
            />

            <View style={styles.daysRow}>
              {timelineData.map((_, i) => (
                <DayLabel
                  key={i}
                  label={dynamicDayLabels[i]}
                  isToday={i === timelineData.length - 1}
                />
              ))}
            </View>

            <View style={[styles.goalContainer, { backgroundColor: `${colors.brand.primary}04`, borderColor: colors.border.default }]}>
              <View style={styles.goalHeader}>
                <Text style={[styles.goalTitle, { color: colors.text.primary }]}>Consistency Progress</Text>
                <Text style={[styles.goalPercent, { color: colors.brand.primary }]}>{stats.consistency}%</Text>
              </View>
              <View style={[styles.progressBarTrack, { backgroundColor: colors.border.default }]}>
                {stats.consistency > 0 && (
                  <View style={[styles.progressBarFill, { width: `${stats.consistency}%`, backgroundColor: colors.brand.primary }]} />
                )}
              </View>
            </View>

            <InsightLabel text={insightText} />
          </>
        )}
      </View>
    </Animated.View>
  );
});

WeeklyHistoryCard.displayName = 'WeeklyHistoryCard';

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  card: {
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3.5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 2.5,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.xs * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockIcon: {
    marginLeft: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: GRAPH_PADDING_H,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  goalContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs * 1.5,
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  goalPercent: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  skeletonTabs: {
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: spacing.md,
  },
  skeletonStats: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: spacing.md,
  },
  skeletonGoal: {
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: spacing.md,
  },
  skeletonTimeline: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: GRAPH_PADDING_H,
  },
  skeletonCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  skeletonLabel: {
    width: 28,
    height: 10,
    borderRadius: 2,
  },
});
