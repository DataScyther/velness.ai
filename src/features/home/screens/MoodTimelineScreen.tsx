import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Brain, Wind, Sparkles, BookOpen, Heart, Info, Star, ChevronLeft, ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMoodEntries } from '@/shared/hooks/useMood';
import { useQuery } from '@tanstack/react-query';
import { journalService } from '../../../../backend/services/JournalService';
import { analyticsService } from '../../../../backend/services/AnalyticsService';
import { WeeklyHistoryHeader } from '../components/WeeklyHistoryHeader';
import { MoodTimelineVisual } from '../components/MoodTimelineVisual';
import { WeeklyStory } from '../components/WeeklyStory';
import { MoodCalendar } from '../components/MoodCalendar';
import { type Mood, type MoodRating, MOOD_MAP } from '@/shared/types';
import { spacing, shadows } from '@/core/theme';

const MOOD_COLORS: Record<number, string> = {
  1: '#FF453A', // Awful (Red)
  2: '#FF9F0A', // Not Good (Orange)
  3: '#8E8E93', // Okay (Gray)
  4: '#5AC8FA', // Good (Blue)
  5: '#30D158', // Great (Green)
};

const SHORT_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Meditation completion/started events. `meditation_session_completed` is the
// string actually emitted by ExerciseScreen; `meditation_completed` and
// `meditation_session_started` are also honored for completeness.
const MEDITATION_EVENTS = [
  'meditation_completed',
  'meditation_session_completed',
  'meditation_session_started',
];
// Sleep events exist in the analytics taxonomy but carry NO duration field
// (only exercise/program/lesson/session ids), so we can only report presence.
const SLEEP_EVENTS = ['sleep_session_started', 'sleep_session_completed'];
// Breathing events emitted by ExerciseScreen for BREATHING-type exercises.
// Both started/completed are counted so a session that began in-week is captured.
const BREATHING_EVENTS = ['breathing_session_started', 'breathing_session_completed'];

/**
 * Returns the [start, end] bounds of a given week. `selectedWeek === 0` is the
 * current calendar week (Sunday-based); each increment steps one week further
 * into the past. `end` is inclusive (end of the final day).
 */
function getWeekBounds(selectedWeek: number): { start: Date; end: Date } {
  const today = new Date();
  const currentStart = new Date(today);
  currentStart.setDate(today.getDate() - today.getDay());
  currentStart.setHours(0, 0, 0, 0);

  const start = new Date(currentStart);
  start.setDate(currentStart.getDate() - selectedWeek * 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function formatRangeDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Animated distribution bar. The fill width eases from 0 → `percentage` on
 * mount (subtle 450ms ease-out) using a reanimated shared value. Keep it
 * number→string so it works on both native and web.
 */
function AnimatedBar({ color, percentage }: { color: string; percentage: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 450,
      easing: Easing.out(Easing.ease),
    });
  }, [percentage, progress]);
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));
  return (
    <Animated.View style={[styles.progressBarFill, { backgroundColor: color }, animatedStyle]} />
  );
}

/**
 * One cell of the compact Weekly Summary supporting strip. Deliberately small
 * and low-contrast so the timeline stays the focal point (Sprint 8 reflow).
 */
function SummaryStat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.compactStat}>
      <Text style={[styles.compactStatValue, { color: colors.text.primary }]}>{value}</Text>
      <Text style={[styles.compactStatLabel, { color: colors.text.tertiary }]}>{label}</Text>
    </View>
  );
}

export function MoodTimelineScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const uid = user?.uid || null;

  // ── Data Queries ─────────────────────────────────────────────────────────────
  const { data: moodEntries = [], isLoading: isLoadingMoods } = useMoodEntries(uid);

  const { data: journals = [], isLoading: isLoadingJournals } = useQuery({
    queryKey: ['journals_list', uid],
    queryFn: () => journalService.list(),
    enabled: !!uid,
  });

  const { data: analyticsEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['analytics_events_list', uid],
    queryFn: () => analyticsService.list(100),
    enabled: !!uid,
  });

  const isLoading = isLoadingMoods || isLoadingJournals || isLoadingEvents;

  // ── Week selector state ───────────────────────────────────────────────────────
  const [selectedWeek, setSelectedWeek] = useState(0);

  const handleWeekChange = useCallback((offset: number) => {
    setSelectedWeek((w) => (w + offset < 0 ? 0 : w + offset));
  }, []);

  // ── Calculations: Weekly Summary (selected-week aware) ────────────────────────
  const {
    weeklySummary,
    dominantEmoji,
    dominantLabel,
    hasDominant,
    heroTrendText,
    heroHasTrend,
  } = useMemo(() => {
    const { start, end } = getWeekBounds(selectedWeek);

    const prevStart = new Date(start);
    prevStart.setDate(start.getDate() - 7);
    prevStart.setHours(0, 0, 0, 0);
    const prevEnd = new Date(start);
    prevEnd.setDate(start.getDate() - 1);
    prevEnd.setHours(23, 59, 59, 999);

    const currEntries = moodEntries.filter((e) => {
      const t = new Date(e.timestamp);
      return t >= start && t <= end;
    });
    const prevEntries = moodEntries.filter((e) => {
      const t = new Date(e.timestamp);
      return t >= prevStart && t <= prevEnd;
    });

    // Dominant (most frequent) mood for the selected week.
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const e of currEntries) counts[e.rating] = (counts[e.rating] || 0) + 1;

    let dominantRating: MoodRating | null = null;
    let maxCount = 0;
    for (const r of [5, 4, 3, 2, 1] as MoodRating[]) {
      if (counts[r] > maxCount) {
        maxCount = counts[r];
        dominantRating = r;
      }
    }

    const dominant =
      dominantRating != null
        ? {
            emoji: MOOD_MAP[dominantRating].emoji,
            label: MOOD_MAP[dominantRating].label,
          }
        : null;

    const currAvg =
      currEntries.length > 0
        ? currEntries.reduce((sum, e) => sum + e.rating, 0) / currEntries.length
        : 0;

    const prevAvg =
      prevEntries.length > 0
        ? prevEntries.reduce((sum, e) => sum + e.rating, 0) / prevEntries.length
        : 0;

    const avgString = currAvg > 0 ? currAvg.toFixed(1) : '—';

    let trendStr = 'no change';
    let percentStr = '';
    let isBetter = false;
    let isWorse = false;
    let heroTrend = '';
    let heroTrendVisible = false;

    if (currAvg > 0 && prevAvg > 0) {
      const diff = currAvg - prevAvg;
      const pct = Math.round((diff / prevAvg) * 100);
      if (pct > 0) {
        trendStr = `better than last week`;
        percentStr = `↑ ${pct}%`;
        isBetter = true;
        heroTrend = `+${pct}% compared to last week`;
        heroTrendVisible = true;
      } else if (pct < 0) {
        trendStr = `lower than last week`;
        percentStr = `↓ ${Math.abs(pct)}%`;
        isWorse = true;
        heroTrend = `${pct}% compared to last week`;
        heroTrendVisible = true;
      } else {
        trendStr = 'consistent with last week';
      }
    } else if (currAvg > 0) {
      trendStr = 'starting your journey';
    }

    return {
      weeklySummary: {
        averageMood: avgString,
        trendText: trendStr,
        percentText: percentStr,
        isBetter,
        isWorse,
      },
      dominantEmoji: dominant?.emoji ?? '',
      dominantLabel: dominant?.label ?? '',
      hasDominant: dominant != null,
      heroTrendText: heroTrend,
      heroHasTrend: heroTrendVisible,
    };
  }, [moodEntries, selectedWeek]);

  const dateRangeText = useMemo(() => {
    const { start, end } = getWeekBounds(selectedWeek);
    return `${formatRangeDate(start)} – ${formatRangeDate(end)}`;
  }, [selectedWeek]);

  // ── Calculations: Weekly Stat Summary (selected-week aware) ──────────────────
  const weeklyStats = useMemo(() => {
    const { start, end } = getWeekBounds(selectedWeek);

    const weekEntries = moodEntries.filter((e) => {
      const t = new Date(e.timestamp);
      return t >= start && t <= end;
    });

    // Mood Stability: 0–100 consistency score for the selected week.
    // std dev of that week's ratings; stability = clamp(100 - (stdDev/2)*100, 0, 100).
    let moodStability = '—';
    let hasStability = false;
    if (weekEntries.length >= 2) {
      const ratings = weekEntries.map((e) => e.rating);
      const mean = ratings.reduce((s, r) => s + r, 0) / ratings.length;
      const variance =
        ratings.reduce((s, r) => s + (r - mean) * (r - mean), 0) / ratings.length;
      const stdDev = Math.sqrt(variance);
      const score = Math.round(Math.min(100, Math.max(0, 100 - (stdDev / 2) * 100)));
      moodStability = `${score}%`;
      hasStability = true;
    }

    // Current Streak: consecutive-day check-ins counting back from today (global).
    const checkedDays = new Set(moodEntries.map((e) => new Date(e.timestamp).toDateString()));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    const cursor = new Date(today);
    while (checkedDays.has(cursor.toDateString())) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Journal Entries within the selected week.
    const journalCount = journals.filter((j) => {
      const t = new Date(j.created_at);
      return t >= start && t <= end;
    }).length;

    // Meditations (completed or session started) within the selected week.
    const meditationCount = analyticsEvents.filter((e) => {
      const t = new Date(e.created_at);
      return (
        (e.event_name === 'meditation_completed' ||
          e.event_name === 'meditation_session_started') &&
        t >= start &&
        t <= end
      );
    }).length;

    // Breathing sessions (started or completed) within the selected week.
    const breathingCount = analyticsEvents.filter((e) => {
      const t = new Date(e.created_at);
      return BREATHING_EVENTS.includes(e.event_name) && t >= start && t <= end;
    }).length;

    return {
      moodStability,
      hasStability,
      currentStreak,
      journalCount,
      meditationCount,
      breathingCount,
    };
  }, [moodEntries, journals, analyticsEvents, selectedWeek]);

  // ── Calculations: Emotion Distribution ───────────────────────────────────────
  const emotionDistribution = useMemo(() => {
    const total = moodEntries.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    for (const entry of moodEntries) {
      counts[entry.rating] = (counts[entry.rating] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([rating, count]) => {
        const rateNum = Number(rating) as MoodRating;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return {
          rating: rateNum,
          emoji: MOOD_MAP[rateNum].emoji,
          label: MOOD_MAP[rateNum].label,
          percentage: pct,
          color: MOOD_COLORS[rateNum],
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [moodEntries]);

  // ── Calculations: AI Mood Insights (MODULE 4) ────────────────────────────────
  const moodInsights = useMemo(() => {
    const insights = [];

    if (moodEntries.length < 3) {
      return [];
    }

    // 1. Meditation correlation
    const meditationDays = new Set(
      analyticsEvents
        .filter((e) => e.event_name === 'meditation_completed' || e.event_name === 'meditation_session_started')
        .map((e) => new Date(e.created_at).toDateString())
    );

    if (meditationDays.size > 0) {
      const meditationMoods = moodEntries.filter((e) => meditationDays.has(new Date(e.timestamp).toDateString()));
      const nonMeditationMoods = moodEntries.filter((e) => !meditationDays.has(new Date(e.timestamp).toDateString()));

      const medAvg = meditationMoods.length > 0
        ? meditationMoods.reduce((sum, e) => sum + e.rating, 0) / meditationMoods.length
        : 0;
      const nonMedAvg = nonMeditationMoods.length > 0
        ? nonMeditationMoods.reduce((sum, e) => sum + e.rating, 0) / nonMeditationMoods.length
        : 0;

      if (medAvg > nonMedAvg && meditationMoods.length >= 1) {
        insights.push({
          id: 'meditation',
          text: 'Your mood lifts after meditation sessions.',
          why: `Slower breathing down-regulates your nervous system, lowering stress before it builds. On meditation days your average mood is ${medAvg.toFixed(1)} vs ${nonMedAvg.toFixed(1)} otherwise.`,
          icon: Sparkles,
          color: '#8B5CF6',
        });
      }
    }

    // 2. Evening stress (Stress after 7 PM)
    const eveningEntries = moodEntries.filter((e) => {
      const hrs = new Date(e.timestamp).getHours();
      return hrs >= 19; // 7 PM
    });
    const lowEveningEntries = eveningEntries.filter((e) => e.rating <= 2);

    if (lowEveningEntries.length >= 2) {
      insights.push({
        id: 'evening_stress',
        text: 'You often feel stress after 7 PM.',
        why: 'Demands accumulate through the day with no wind-down, so tension peaks in the evening.',
        icon: Brain,
        color: '#FF9F0A',
      });
    }

    // 3. Sleep correlation
    let sleepCorrelates = false;
    let sleepLowCount = 0;
    for (const journal of journals) {
      const text = `${journal.title || ''} ${journal.body || ''}`.toLowerCase();
      const hasSleepMention = text.includes('sleep') || text.includes('tired') || text.includes('fatigue') || text.includes('insomnia');
      const journalDate = new Date(journal.created_at).toDateString();
      const sameDayMood = moodEntries.find((e) => new Date(e.timestamp).toDateString() === journalDate);
      if (hasSleepMention && sameDayMood && sameDayMood.rating <= 2) {
        sleepLowCount++;
      }
    }

    if (sleepLowCount >= 2) {
      insights.push({
        id: 'sleep_correlation',
        text: 'Short sleep tracks with lower mood.',
        why: 'Poor rest depletes emotional regulation, making low ratings more likely the next day.',
        icon: BookOpen,
        color: '#6366F1',
      });
    }

    // 4. Journaling impact
    const journaledDays = new Set(journals.map((j) => new Date(j.created_at).toDateString()));
    if (journaledDays.size >= 2) {
      insights.push({
        id: 'journal_consistency',
        text: 'Journaling steadies your mood.',
        why: 'Naming feelings externalizes them, which takes the edge off their intensity.',
        icon: Heart,
        color: '#10B981',
      });
    }

    // Fallback default insight if no specific patterns calculated yet
    if (insights.length === 0) {
      insights.push({
        id: 'general_growth',
        text: 'Keep tracking to surface deeper patterns.',
        why: 'Consistent logging reveals the quiet links between your habits and mood, so small changes add up over time.',
        icon: Info,
        color: colors.brand.primary,
      });
    }

    return insights;
  }, [moodEntries, analyticsEvents, journals, colors]);

  // ── Calculations: Weekly Mood Timeline (Sprint 3 flagship) ────────────────
  const weekTimelineDays = useMemo(() => {
    const { start } = getWeekBounds(selectedWeek);

    const isSameDay = (iso: string, day: Date) =>
      new Date(iso).toDateString() === day.toDateString();

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      day.setHours(0, 0, 0, 0);

      const dayEntries = moodEntries.filter(
        (e) => new Date(e.timestamp).toDateString() === day.toDateString()
      );
      const latest = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;

      const meditationDone = analyticsEvents.some(
        (e) => MEDITATION_EVENTS.includes(e.event_name) && isSameDay(e.created_at, day)
      );

      const sleepEvent = analyticsEvents.some(
        (e) => SLEEP_EVENTS.includes(e.event_name) && isSameDay(e.created_at, day)
      );

      days.push({
        dayName: SHORT_DAY[day.getDay()],
        date: day,
        rating: latest ? latest.rating : null,
        note: latest && latest.note ? latest.note : null,
        meditationDone,
        sleepText: sleepEvent ? 'Done' : null,
      });
    }

    return days;
  }, [moodEntries, analyticsEvents, selectedWeek]);

  const hasData = moodEntries.length > 0;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={['top']}>
      {/* Top Header Row */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <ChevronLeft size={28} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text.primary }]}>Analysis & Trends</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Living Dashboard Header widget */}
        <WeeklyHistoryHeader
          selectedWeek={selectedWeek}
          onWeekChange={handleWeekChange}
          dateRangeText={dateRangeText}
          dominantEmoji={dominantEmoji}
          dominantLabel={dominantLabel}
          hasDominant={hasDominant}
          trendText={heroTrendText}
          isBetter={weeklySummary.isBetter}
          isWorse={weeklySummary.isWorse}
          hasTrend={heroHasTrend}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.brand.primary} />
          </View>
        ) : !hasData ? (
          <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Text style={[styles.emptyTextTitle, { color: colors.text.primary }]}>No Entries Found</Text>
            <Text style={[styles.emptyTextSub, { color: colors.text.secondary }]}>
              Logging your daily mood unlocks timeline visualizations and personalized AI insights.
            </Text>
          </View>
        ) : (
          <>
            {/* ── Weekly Story (signature narrative — lead-in to the arc) ── */}
            <WeeklyStory
              days={weekTimelineDays}
              weekLabel={selectedWeek === 0 ? 'This Week' : dateRangeText}
            />

            {/* ── Weekly Mood Timeline (Sprint 3, signature hero) ───────── */}
            <MoodTimelineVisual
              days={weekTimelineDays}
              weekLabel={selectedWeek === 0 ? 'This Week' : dateRangeText}
            />

            {/* ── Weekly Summary (Sprint 2 — compact supporting strip) ──── */}
            <View style={[styles.compactSummary, { backgroundColor: colors.surface.secondary, borderColor: colors.border.default }]}>
              <View style={styles.compactSummaryMain}>
                <View style={styles.compactAvgBlock}>
                  <Text style={[styles.compactAvg, { color: colors.text.primary }]}>
                    {weeklySummary.averageMood}
                    <Text style={[styles.compactAvgUnit, { color: colors.text.tertiary }]}>/5</Text>
                  </Text>
                  <View style={styles.trendLine}>
                    {weeklySummary.isBetter ? (
                      <ArrowUpRight size={14} color={colors.success} />
                    ) : weeklySummary.isWorse ? (
                      <ArrowDownRight size={14} color={colors.danger} />
                    ) : (
                      <TrendingUp size={14} color={colors.text.tertiary} />
                    )}
                    <Text style={[
                      styles.compactTrend,
                      {
                        color: weeklySummary.isBetter
                          ? colors.success
                          : weeklySummary.isWorse
                          ? colors.danger
                          : colors.text.tertiary,
                      },
                    ]}>
                      {weeklySummary.trendText}
                    </Text>
                  </View>
                </View>
                {hasDominant ? (
                  <View style={[styles.compactChip, { borderColor: colors.border.default }]}>
                    <Text style={styles.compactChipText}>{`${dominantEmoji} ${dominantLabel}`}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.compactStats}>
                <SummaryStat label="Stability" value={weeklyStats.moodStability} />
                <SummaryStat label="Streak" value={`${weeklyStats.currentStreak}d`} />
                <SummaryStat label="Journal" value={`${weeklyStats.journalCount}`} />
                <SummaryStat label="Meditate" value={`${weeklyStats.meditationCount}`} />
              </View>
            </View>

            {/* ── Monthly Mood Calendar (Sprint 4) ─────────────────────── */}
            <MoodCalendar moodEntries={moodEntries} />

            {/* ── Emotion Distribution (Redesign: Most Common Emotion) ─────── */}
            <View style={[styles.card, styles.distCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }, shadows.glass]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Most Common Emotion</Text>

              {emotionDistribution.length > 0 ? (
                (() => {
                  const dominant = emotionDistribution[0];
                  const rest = emotionDistribution.slice(1);
                  return (
                    <>
                      {/* Dominant hero */}
                      <View style={styles.distHero}>
                        <Text style={styles.distHeroEmoji}>{dominant.emoji}</Text>
                        <View style={styles.distHeroBody}>
                          <Text style={[styles.distHeroLabel, { color: colors.text.primary }]}>
                            {dominant.label}
                          </Text>
                          <Text style={[styles.distHeroPct, { color: dominant.color }]}>
                            {dominant.percentage}%
                          </Text>
                        </View>
                      </View>

                      {/* Remaining emotions */}
                      <View style={styles.distributionList}>
                        {rest.map((dist, idx) => (
                          <View key={idx} style={styles.distRow}>
                            <Text style={styles.distEmoji}>{dist.emoji}</Text>
                            <Text style={[styles.distLabel, { color: colors.text.primary }]}>{dist.label}</Text>

                            <View style={styles.progressContainer}>
                              <View style={[styles.progressBarBg, { backgroundColor: colors.border.default }]}>
                                <AnimatedBar color={dist.color} percentage={dist.percentage} />
                              </View>
                            </View>

                            <Text style={[styles.distPct, { color: colors.text.secondary }]}>{dist.percentage}%</Text>
                          </View>
                        ))}
                      </View>

                      {/* Footer stat row */}
                      <View style={[styles.distFooter, { borderTopColor: colors.border.default }]}>
                        <View style={styles.distFooterCell}>
                          <Text style={[styles.distFooterLabel, { color: colors.text.tertiary }]}>Total</Text>
                          <Text style={[styles.distFooterValue, { color: colors.text.primary }]}>
                            {moodEntries.length}
                          </Text>
                        </View>
                        <View style={styles.distFooterCell}>
                          <Text style={[styles.distFooterLabel, { color: colors.text.tertiary }]}>Dominant</Text>
                          <Text style={[styles.distFooterValue, { color: colors.text.primary }]}>
                            {dominant.emoji}
                          </Text>
                        </View>
                        <View style={styles.distFooterCell}>
                          <Text style={[styles.distFooterLabel, { color: colors.text.tertiary }]}>Trend</Text>
                          <View style={styles.distFooterTrend}>
                            {weeklySummary.isBetter ? (
                              <ArrowUpRight size={16} color={colors.success} />
                            ) : weeklySummary.isWorse ? (
                              <ArrowDownRight size={16} color={colors.danger} />
                            ) : (
                              <TrendingUp size={16} color={colors.text.secondary} />
                            )}
                            {weeklySummary.percentText ? (
                              <Text style={[
                                styles.distFooterValue,
                                {
                                  color: weeklySummary.isBetter
                                    ? colors.success
                                    : weeklySummary.isWorse
                                    ? colors.danger
                                    : colors.text.secondary,
                                },
                              ]}>
                                {weeklySummary.percentText}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    </>
                  );
                })()
              ) : (
                <View style={styles.distHero}>
                  <Text style={styles.distHeroEmoji}>—</Text>
                  <View style={styles.distHeroBody}>
                    <Text style={[styles.distHeroLabel, { color: colors.text.primary }]}>No data</Text>
                    <Text style={[styles.distHeroPct, { color: colors.text.secondary }]}>—</Text>
                  </View>
                </View>
              )}
            </View>

            {/* ── AI Insights (MODULE 4, Sprint 6) ───────────────────────── */}
            <Animated.View entering={FadeInDown.duration(400)} style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }, shadows.glass]}>
              <View style={styles.insightsHeader}>
                <BarChart3 size={18} color={colors.brand.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary, marginLeft: spacing.xs }]}>
                  AI Insights
                </Text>
              </View>

              {moodEntries.length < 3 ? (
                (() => {
                  const needed = Math.max(0, 3 - moodEntries.length);
                  return (
                    <View style={styles.insightsLocked}>
                      <Info size={24} color={colors.brand.secondary} style={{ marginBottom: spacing.xs }} />
                      <Text style={[styles.lockedTitle, { color: colors.text.primary }]}>Unlock Personalized Insights</Text>
                      <Text style={[styles.lockedDesc, { color: colors.text.secondary }]}>
                        {needed === 0
                          ? 'Almost there — one more check-in unlocks insights'
                          : `${needed} more check-ins needed`}
                      </Text>

                      <View style={styles.unlockList}>
                        {['Mood patterns', 'Stress triggers', 'Sleep correlations', 'Personalized recommendations'].map((item) => (
                          <View key={item} style={styles.unlockItem}>
                            <CheckCircle size={16} color={colors.success} />
                            <Text style={[styles.unlockText, { color: colors.text.secondary }]}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })()
              ) : (
                <View style={styles.insightsList}>
                  {moodInsights.map((insight, i) => {
                    const InsightIcon = insight.icon;
                    return (
                      <Animated.View
                        key={insight.id}
                        entering={FadeInDown.delay(i * 60).duration(350)}
                        style={[styles.insightItem, { borderColor: colors.border.default }]}
                      >
                        <View style={[styles.insightIconWrap, { backgroundColor: `${insight.color}15` }]}>
                          <InsightIcon size={18} color={insight.color} />
                        </View>
                        <View style={styles.insightContent}>
                          <Text style={[styles.insightTitle, { color: colors.text.primary }]}>
                            {insight.text}
                          </Text>
                          <Text style={[styles.insightDesc, { color: colors.text.secondary }]}>
                            {insight.why}
                          </Text>
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </Animated.View>

            {/* ── Weekly Reflection (Sprint 7, closing section) ─────────────── */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }, shadows.glass]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Weekly Reflection</Text>

              <Text style={[styles.reflectionHeadline, { color: colors.text.primary }]}>
                {weeklySummary.isBetter
                  ? 'This week you felt calmer than last week.'
                  : weeklySummary.isWorse
                    ? 'This week you felt more tense than last week.'
                    : 'This week felt about the same as last week.'}
              </Text>

              <View style={styles.reflectionStats}>
                <View style={styles.reflectionStat}>
                  <Text style={[styles.reflectionStatValue, { color: colors.text.primary }]}>
                    {weeklyStats.journalCount}
                  </Text>
                  <Text style={[styles.reflectionStatLabel, { color: colors.text.secondary }]}>Reflections</Text>
                </View>
                <View style={styles.reflectionStat}>
                  <Text style={[styles.reflectionStatValue, { color: colors.text.primary }]}>
                    {weeklyStats.meditationCount}
                  </Text>
                  <Text style={[styles.reflectionStatLabel, { color: colors.text.secondary }]}>Meditation sessions</Text>
                </View>
                <View style={styles.reflectionStat}>
                  <Text style={[styles.reflectionStatValue, { color: colors.text.primary }]}>
                    {weeklyStats.breathingCount}
                  </Text>
                  <Text style={[styles.reflectionStatLabel, { color: colors.text.secondary }]}>Breathing sessions</Text>
                </View>
              </View>

              <Text style={[styles.reflectionClosing, { color: colors.text.tertiary, borderTopColor: colors.border.default }]}>
                Keep your current evening routine.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRightPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['2xl'],
    gap: spacing.lg,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  emptyTextTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyTextSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  compactSummary: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  compactSummaryMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  compactAvgBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactAvg: {
    fontSize: 18,
    fontWeight: '800',
  },
  compactAvgUnit: {
    fontSize: 12,
    fontWeight: '700',
  },
  compactTrend: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  compactChip: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
  },
  compactChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  compactStat: {
    flex: 1,
    alignItems: 'flex-start',
  },
  compactStatValue: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 1,
  },
  compactStatLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  trendLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: '55%',
  },
  distCard: {
    minHeight: 170,
  },
  distHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  distHeroEmoji: {
    fontSize: 40,
    marginRight: spacing.sm,
  },
  distHeroBody: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  distHeroLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  distHeroPct: {
    fontSize: 26,
    fontWeight: '800',
  },
  distributionList: {
    gap: spacing.sm,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  distLabel: {
    width: 72,
    fontSize: 13,
    fontWeight: '600',
  },
  distFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  distFooterCell: {
    flex: 1,
    alignItems: 'flex-start',
  },
  distFooterLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  distFooterValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  distFooterTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  distPct: {
    width: 32,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  insightsLocked: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  lockedDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: spacing.md,
  },
  insightsList: {
    gap: spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
  },
  insightIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
    lineHeight: 18,
  },
  insightDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  unlockList: {
    marginTop: spacing.md,
    width: '100%',
    gap: spacing.xs,
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  unlockText: {
    fontSize: 13,
    fontWeight: '500',
  },
  reflectionHeadline: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  reflectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  reflectionStat: {
    flex: 1,
    alignItems: 'flex-start',
  },
  reflectionStatValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  reflectionStatLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  reflectionClosing: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
    textAlign: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
});
