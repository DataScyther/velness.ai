import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Trophy, TrendingUp, BarChart3, Flame, Clock, Star, CheckCircle } from 'lucide-react-native';
import { StarIcon } from '@/shared/components/SymbolIcons';
import { useTheme } from '@/hooks/useTheme';
import { useJourney } from '@/shared/hooks/useJourney';
import { spacing, borderRadius } from '@/core/theme';
import { ROUTES, buildRoute } from '@/core/config/routes';
import { computeWeeklyProgressV2, computeAchievements } from '@/features/journey/services/JourneyService';
import { DEFAULT_LESSONS } from '@/features/journey/data/programs';
import type { Milestone } from '@/features/journey/models';

function getAchievementIcon(achieved: boolean) {
  const color = achieved ? '#FBBF24' : 'rgba(255,255,255,0.2)';
  return <Star size={20} color={color} fill={color} />;
}

export function ProgressScreen() {
  const { colors } = useTheme();
  const { exercises, userProgress, programs, streak, weeklyProgress, daysPracticed, minutesCompleted, programsCompleted, favoritePractice } = useJourney();

  const weeklyData = useMemo(() => {
    if (!exercises) return [];
    const progressMap: Record<string, { completed: boolean; streak: number; lastCompletedAt?: Date }> = {};
    for (const ex of exercises) {
      if (ex.lastCompletedAt) {
        progressMap[ex.id] = { completed: true, streak: ex.streak, lastCompletedAt: ex.lastCompletedAt };
      }
    }
    return computeWeeklyProgressV2(progressMap as any);
  }, [exercises]);

  const achievements = useMemo(() => {
    if (!userProgress) return [];
    return computeAchievements(userProgress);
  }, [userProgress]);

  const programCards = useMemo(() => {
    if (!userProgress || !programs) return [];
    return programs.map(program => {
      const prog = userProgress.programProgress[program.id];
      const total = DEFAULT_LESSONS.filter((l) => l.programId === program.id).length;
      const completed = prog?.completedLessonIds?.length ?? 0;
      return {
        id: program.id,
        title: program.title,
        completed,
        total,
        status: prog?.status ?? 'not_started',
      };
    });
  }, [programs, userProgress]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.primary }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <ArrowLeft size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Your Progress</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Flame size={22} color="#F97316" />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{daysPracticed}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Days Practiced</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Clock size={22} color={colors.brand.primary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{minutesCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Minutes Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <TrendingUp size={22} color="#22C55E" />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Current Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Trophy size={22} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{programsCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Programs Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Star size={22} color="#A855F7" />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{favoritePractice}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Favorite Practice</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>This Week</Text>
        <View style={[styles.heatmapCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
          <View style={styles.heatmapRow}>
            {weeklyData.map((day, idx) => (
              <View key={idx} style={styles.heatmapDay}>
                <View
                  style={[
                    styles.heatmapDot,
                    { backgroundColor: day.completed ? colors.success : colors.border.default },
                  ]}
                />
                <Text style={[styles.heatmapLabel, { color: colors.text.secondary }]}>{day.day}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.heatmapSummary, { color: colors.text.secondary }]}>
            {weeklyProgress}/7 days this week
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Programs</Text>
        {programCards.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No programs started yet.</Text>
          </View>
        ) : (
          programCards.map((prog) => (
            <Pressable
              key={prog.id}
              style={[styles.programCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}
              onPress={() => router.push(buildRoute(ROUTES.JOURNEY.PROGRAM, { programId: prog.id }) as any)}
              accessibilityRole="button"
            >
                <View style={styles.programInfo}>
                  <Text style={[styles.programName, { color: colors.text.primary }]}>{prog.title}</Text>
                  <Text style={[styles.programStatus, { color: colors.text.secondary }]}>
                    {prog.status === 'completed' ? 'Completed' : prog.status === 'active' ? 'In Progress' : 'Not Started'}
                  </Text>
                </View>
                <Text style={[styles.programPercent, { color: colors.text.secondary }]}>
                  {prog.completed} of {prog.total} lessons complete
                </Text>
            </Pressable>
          ))
        )}

        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Achievements</Text>
        <View style={[styles.achievementsCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
          {achievements.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Complete exercises to earn achievements.</Text>
          ) : (
            achievements.map((ms: Milestone) => {
              const isRecent = ms.achievedAt && (new Date().getTime() - new Date(ms.achievedAt).getTime() < 24 * 60 * 60 * 1000);
              return (
                <View
                  key={ms.id}
                  style={[
                    styles.achievementRow,
                    isRecent && {
                      backgroundColor: `${colors.warning}15`,
                      borderColor: colors.warning,
                      borderWidth: 1,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginHorizontal: -spacing.sm,
                    }
                  ]}
                >
                  {getAchievementIcon(!!ms.achievedAt)}
                  <View style={styles.achievementInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.achievementTitle, { color: colors.text.primary }]}>{ms.title}</Text>
                      {isRecent && (
                        <View style={{ backgroundColor: colors.warning, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: colors.background.primary }}>NEW</Text>
                            <StarIcon size={9} color={colors.background.primary} />
                          </View>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.achievementDesc, { color: colors.text.secondary }]}>{ms.description}</Text>
                  </View>
                  {ms.achievedAt && (
                    <CheckCircle size={16} color={colors.success} />
                  )}
                </View>
              );
            })
          )}
        </View>

        <Pressable
          style={[styles.backToJourney, { borderColor: colors.border.default }]}
          onPress={() => router.push(ROUTES.JOURNEY.HOME as any)}
          accessibilityRole="button"
        >
          <Text style={[styles.backToJourneyText, { color: colors.text.primary }]}>Back to Journey</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSpacer: { width: 32 },
  scrollContent: { paddingBottom: spacing['5xl'], paddingHorizontal: spacing.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  statCard: {
    width: '31%',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing['2xl'], marginBottom: spacing.md },
  heatmapCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  heatmapRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heatmapDay: { alignItems: 'center', gap: spacing.xs },
  heatmapDot: { width: 28, height: 28, borderRadius: 8 },
  heatmapLabel: { fontSize: 11, fontWeight: '500' },
  heatmapSummary: { fontSize: 13, marginTop: spacing.md, textAlign: 'center' },
  emptyCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14 },
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  programInfo: { flex: 1 },
  programName: { fontSize: 15, fontWeight: '600' },
  programStatus: { fontSize: 12, marginTop: 2 },
  programBar: { flex: 1, maxWidth: 80 },
  programPercent: { fontSize: 12, fontWeight: '600', width: 36, textAlign: 'right' },
  achievementsCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  achievementRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 14, fontWeight: '600' },
  achievementDesc: { fontSize: 12, marginTop: 1 },
  backToJourney: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    marginTop: spacing['2xl'],
  },
  backToJourneyText: { fontSize: 15, fontWeight: '500' },
});

export default ProgressScreen;
