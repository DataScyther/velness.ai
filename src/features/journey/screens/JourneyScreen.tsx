/**
 * JourneyScreen — Guided Progression System
 *
 * This is NOT a Netflix-style content library.
 * This is a guided progression system answering one simple question:
 * "What should I do next?"
 *
 * Information Hierarchy (5 Sections):
 *  1. Continue Your Journey (Hero Card)
 *  2. Recommended Today (Single custom suggestion)
 *  3. Explore Practices (CBT, Breathing, Meditation, Wellness Studio 2x2 Grid)
 *  4. Completed Sessions (List of finished activities)
 *  5. Your Progress (Streak, Session stats, Weekly progress)
 */

import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Brain, Wind, Sparkles, Leaf, CheckCircle2, ChevronRight, Flame, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/shared/hooks/useAuth';
import { useJourney } from '@/shared/hooks/useJourney';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ROUTES } from '@/core/config/routes';
import { spacing, borderRadius } from '@/core/theme';

import {
  JourneyHeader,
  JourneySectionHeader,
  WeeklyProgressTracker,
} from '../components';

import { COMPLETION_STATUS } from '@/features/journey/constants';
import { DEFAULT_LESSONS } from '@/features/journey/data/programs';
import { DEFAULT_EXERCISES } from '@/features/journey/data/exercises';
import { DEFAULT_PROGRAMS } from '@/features/journey/data/programs';

export function JourneyScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const uid = user?.uid || null;
  const [refreshing, setRefreshing] = useState(false);

  const {
    journey,
    userProgress,
    streak,
    weeklyProgress,
    exercisesCompleted,
    isLoading,
    error,
    resumeJourney,
    refresh,
    programs,
    exercises,
  } = useJourney();

  const activeProg = useMemo(() => {
    if (!journey || !programs) return null;
    return programs.find((p) => p.id === journey.programId);
  }, [journey, programs]);

  const minutesRemaining = useMemo(() => {
    if (!journey) return 8;
    const prog = userProgress?.programProgress[journey.programId];
    if (prog?.estimatedRemainingTime != null) return Math.max(prog.estimatedRemainingTime, 1);
    if (!activeProg) return 8;
    return Math.max(Math.round(activeProg.duration * (1 - (journey.completionPercent || 0) / 100)), 5);
  }, [journey, activeProg, userProgress]);

  const lessonTitle = useMemo(() => {
    if (!journey) return 'Understanding Thought Patterns';
    const activeProgLessons = DEFAULT_LESSONS.filter((l) => l.programId === journey.programId)
      .sort((a, b) => a.order - b.order);
    const currentLessonObj = activeProgLessons.find((l) => l.order === journey.currentLesson) || activeProgLessons[0];
    return currentLessonObj?.title || 'Understanding Thought Patterns';
  }, [journey]);

  const categoryLabel = useMemo(() => {
    if (!activeProg) return 'CBT FOUNDATIONS';
    if (activeProg.categoryId === 'cbt') return 'CBT Foundations';
    if (activeProg.categoryId === 'breathing') return 'Breathing Practice';
    if (activeProg.categoryId === 'meditation') return 'Guided Meditation';
    return 'Wellness Program';
  }, [activeProg]);

  // Filter completed exercises
  const completedSessions = useMemo(() => {
    const list = exercises
      .filter((ex) => ex.completionStatus === COMPLETION_STATUS.COMPLETED || ex.lastCompletedAt)
      .map((ex) => {
        const lesson = DEFAULT_LESSONS.find((l) => l.id === ex.lessonId);
        const program = DEFAULT_PROGRAMS.find((p) => p.id === lesson?.programId);
        return {
          id: ex.id,
          title: ex.title,
          type: ex.type,
          lastCompletedAt: ex.lastCompletedAt ? new Date(ex.lastCompletedAt) : new Date(),
          programTitle: program?.title || 'Practice',
          duration: ex.estimatedTime,
        };
      })
      .sort((a, b) => b.lastCompletedAt.getTime() - a.lastCompletedAt.getTime());
    return list.slice(0, 5); // display top 5 completed sessions
  }, [exercises]);

  const practiceCategories = [
    { id: 'cbt', title: 'CBT', emoji: '🧠', description: 'Reframe thoughts & build cognitive skills', countLabel: '6 lessons', color: '#8B5CF6' },
    { id: 'breathing', title: 'Breathing', emoji: '🌬', description: 'Regulate your nervous system & relax', countLabel: '3 lessons', color: '#06B6D4' },
    { id: 'meditation', title: 'Meditation', emoji: '🧘', description: 'Cultivate presence & daily focus', countLabel: '3 lessons', color: '#EC4899' },
    { id: 'wellness', title: 'Wellness Studio', emoji: '✨', description: 'Reflect and build positive habits', countLabel: '3 lessons', color: '#10B981' },
  ];

  // ── Handlers ───────────────────────────────────────────────────────────

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      console.error('[JourneyScreen] Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleContinue = useCallback(() => {
    if (journey) {
      resumeJourney(journey);
    }
  }, [journey, resumeJourney]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    if (categoryId === 'breathing' || categoryId === 'meditation' || categoryId === 'wellness') {
      const path = ROUTES.JOURNEY.CATEGORY.replace('[categoryId]', categoryId);
      router.push(path as any);
      return;
    }
    const path = ROUTES.JOURNEY.PROGRAM.replace('[programId]', 'cbt-foundations');
    router.push(path as any);
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <JourneyHeader streak={0} />
        <View style={styles.errorContainer}>
          <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>
            Something went wrong loading your journey.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand.primary}
            colors={[colors.brand.primary]}
          />
        }
      >
        {/* Header */}
        <JourneyHeader streak={streak} />

        {/* ── Recommended Today (migrated from Continue Your Journey) ─────── */}
        <View style={styles.sectionContainer}>
          <JourneySectionHeader title="Recommended today" />
          <Pressable onPress={handleContinue} style={styles.heroPressable}>
            <LinearGradient
              colors={isDark ? ['#312E81', '#1E1B4B'] : ['#F3E8FF', '#FAF5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.heroCard,
                {
                  borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(108, 76, 241, 0.15)',
                },
              ]}
            >
              <View style={styles.heroBadgeRow}>
                <View style={[styles.heroBadge, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(108, 76, 241, 0.1)' }]}>
                  <Text style={[styles.heroBadgeText, { color: isDark ? '#A78BFA' : '#6C4CF1' }]}>
                    CONTINUE
                  </Text>
                </View>
                <Text style={[styles.heroDurationText, { color: colors.text.secondary }]}>
                  {minutesRemaining} min remaining
                </Text>
              </View>

              <Text style={[styles.heroProgramTitle, { color: colors.text.primary }]}>
                {journey?.title || 'CBT Foundations'}
              </Text>

              <Text style={[styles.heroLessonOrder, { color: colors.text.secondary }]}>
                Lesson {journey?.currentLesson || 1} of {journey?.totalLessons || 8}
              </Text>

              <Text style={[styles.heroLessonTitle, { color: colors.text.primary }]}>
                {lessonTitle}
              </Text>

              <View style={styles.heroFooter}>
                <Text style={[styles.progressPercentText, { color: colors.text.secondary }]}>
                  {minutesRemaining} min remaining
                </Text>
                <View style={[styles.heroButton, { backgroundColor: isDark ? '#8B5CF6' : '#6C4CF1' }]}>
                  <Text style={styles.heroButtonText}>Continue →</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* ── Pillar 3: Explore Practices ─────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <JourneySectionHeader title="Explore practices" />
          <View style={styles.gridContainer}>
            {practiceCategories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: colors.surface.primary,
                    borderColor: isDark ? colors.border.default : '#E5E7EB',
                  },
                ]}
              >
                <Text style={styles.gridEmoji}>{cat.emoji}</Text>
                <Text style={[styles.gridTitle, { color: colors.text.primary }]}>
                  {cat.title}
                </Text>
                <Text style={[styles.gridDescription, { color: colors.text.secondary }]} numberOfLines={2}>
                  {cat.description}
                </Text>
                <View style={[styles.gridCountBadge, { backgroundColor: `${cat.color}15` }]}>
                  <Text style={[styles.gridCountText, { color: cat.color }]}>
                    {cat.countLabel}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Pillar 4: Completed Sessions ───────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <JourneySectionHeader title="Completed sessions" />
          {completedSessions.length > 0 ? (
            <View style={styles.completedContainer}>
              {completedSessions.map((session, index) => (
                <View
                  key={session.id}
                  style={[
                    styles.completedItem,
                    {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6',
                      borderBottomWidth: index < completedSessions.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  <CheckCircle2 size={20} color={colors.success} style={styles.completedIcon} />
                  <View style={styles.completedContent}>
                    <Text style={[styles.completedTitle, { color: colors.text.primary }]}>
                      {session.title}
                    </Text>
                    <Text style={[styles.completedMeta, { color: colors.text.secondary }]}>
                      {session.programTitle} · {session.duration} min
                    </Text>
                  </View>
                  <Text style={[styles.completedDate, { color: colors.text.tertiary }]}>
                    {session.lastCompletedAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.emptyCompletedCard,
                {
                  backgroundColor: colors.surface.primary,
                  borderColor: isDark ? colors.border.default : '#E5E7EB',
                },
              ]}
            >
              <Trophy size={28} color={isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'} style={styles.emptyIcon} />
              <Text style={[styles.emptyCompletedText, { color: colors.text.secondary }]}>
                Your completed sessions will appear here as you practice.
              </Text>
            </View>
          )}
        </View>

        {/* ── Pillar 5: Your Progress ────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <JourneySectionHeader title="Your progress" />
          <View style={styles.progressStatsRow}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface.primary,
                  borderColor: isDark ? colors.border.default : '#E5E7EB',
                },
              ]}
            >
              <Flame size={20} color="#F97316" />
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{streak}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Day Streak</Text>
              </View>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface.primary,
                  borderColor: isDark ? colors.border.default : '#E5E7EB',
                },
              ]}
            >
              <CheckCircle2 size={20} color="#10B981" />
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{exercisesCompleted}</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Sessions</Text>
              </View>
            </View>
          </View>
          <View style={styles.weeklyTrackerWrapper}>
            <WeeklyProgressTracker activeDays={weeklyProgress} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: spacing.xl,
  },
  sectionContainer: {
    marginTop: spacing['2xl'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Pillar 1: Continue Your Journey
  heroPressable: {
    marginTop: spacing.md,
  },
  heroCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroDurationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  heroProgramTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 4,
  },
  heroLessonOrder: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  heroLessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: spacing.xl,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Pillar 3: Explore Practices
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  gridItem: {
    width: '47.5%',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  gridEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridDescription: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: spacing.sm,
    flex: 1,
  },
  gridCountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridCountText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Pillar 4: Completed Sessions
  completedContainer: {
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 0,
    overflow: 'hidden',
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  completedIcon: {
    marginRight: spacing.md,
  },
  completedContent: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  completedMeta: {
    fontSize: 11,
  },
  completedDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyCompletedCard: {
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: spacing.sm,
  },
  emptyCompletedText: {
    fontSize: 13,
    textAlign: 'center',
  },

  // Pillar 5: Your Progress
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  statContent: {
    marginLeft: spacing.md,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  weeklyTrackerWrapper: {
    marginTop: spacing.md,
  },
});

export default JourneyScreen;
