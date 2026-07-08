/**
 * HomeScreen — The narrative home experience, powered by the Home Intelligence
 * Layer (HomeService.fetchHomeState()).
 *
 * Scroll order = user story:
 *   1. HomeHeader          (top bar — brand + notifications badge)
 *   2. HeroCard            (large gradient — greeting + adaptive content)
 *   3. QuickActionsBar     (5 one-tap circular buttons)
 *   4. Two-column row      (ContinueJourneyCard + TodaysMissionCard)
 *   5. Reflection          (today's journal entry or write prompt)
 *   6. WeeklyHistoryCard   (compact mood timeline)
 *   7. SmartRecommendation (contextual "because…" card)
 *   8. Progress            (aggregate completion stats)
 *   9. Mood check-in flow  (selector + reflection + submit)
 *  10. SyncStatusBanner    (offline / pending queue indicator)
 */
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { router } from 'expo-router';
import { buildRoute, ROUTES } from '@/core/config/routes';
import { useAuth } from '@/shared/hooks/useAuth';
import { useSaveMood } from '@/shared/hooks/useMood';
import { moodRepository } from '@/repositories/MoodRepository';
import type { Mood, MoodRating } from '@/shared/types';
import { MOOD_MAP } from '@/shared/types';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { spacing } from '@/core/theme';
import { useSyncRefresh } from '@/shared/hooks/useSyncRefresh';
import { useSyncStore } from '@/core/store/useSyncStore';
import { ReflectionInput } from '../components/ReflectionInput';
import { useTheme } from '@/hooks/useTheme';

import {
  HomeHeader,
  MoodSelector,
  JourneyLoadingState,
  JourneyErrorState,
  EmptyJourneyState,
} from '../components';

import { HeroCard } from '../components/HeroCard';
import { QuickActionsBar } from '../components/QuickActionsBar';
import { ContinueJourneyCard } from '../components/ContinueJourneyCard';
import { TodaysMissionCard } from '../components/TodaysMissionCard';
import { WeeklyHistoryCard } from '../components/WeeklyHistoryCard';
import { SmartRecommendationCard } from '../components/SmartRecommendationCard';

import {
  useHomeState,
  HOME_STATE_QUERY_KEY,
} from '@/features/home/hooks/useHomeState';
import { missionService } from '../../../../backend/services/MissionService';
import { journalService } from '../../../../backend/services/JournalService';

export function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const uid = user?.uid || null;
  const queryClient = useQueryClient();

  // ── Home Intelligence Layer ───────────────────────────────────────────────────
  const { data: home, isLoading, error } = useHomeState();

  const greeting = home?.greeting;
  const mission = home?.todaysMission ?? null;
  const journey = home?.journey ?? null;
  const reflection = home?.reflection;
  const mood = home?.mood;
  const recommendation = home?.recommendation;
  const progress = home?.progress;
  const notifications = home?.notifications;

  // ── Local state ──────────────────────────────────────────────────────────────
  const saveMoodMutation = useSaveMood();
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Sync ─────────────────────────────────────────────────────────────────────
  useSyncRefresh();
  const pendingQueue = useSyncStore((s) => s.pendingQueue);
  const isSyncing = useSyncStore((s) => s.isSyncing);
  const isOnline = useSyncStore((s) => s.isOnline);
  const lastError = useSyncStore((s) => s.lastError);
  const processQueue = useSyncStore((s) => s.processQueue);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCheckIn = useCallback(() => setShowSelector(true), []);

  const handleSelectMood = useCallback((value: MoodRating) => setSelectedMood(value), []);

  const handleSubmitMood = useCallback(async () => {
    if (selectedMood === null || !uid) return;
    const entry: Mood = {
      id: `mood-${Date.now()}`,
      rating: selectedMood,
      note: reflectionNote,
      timestamp: new Date(),
    };
    try {
      await saveMoodMutation.mutateAsync({ uid, entry });
      setIsSuccess(true);
      setShowSelector(false);
      setReflectionNote('');
      void queryClient.invalidateQueries({ queryKey: HOME_STATE_QUERY_KEY });
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error('[HomeScreen] Check-in save error:', err);
    }
  }, [selectedMood, reflectionNote, uid, saveMoodMutation, queryClient]);

  const handleHeroCta = useCallback(() => {
    if (!mood?.today) {
      handleCheckIn();
    } else if (journey) {
      router.push(ROUTES.JOURNEY.HOME);
    } else {
      router.push(ROUTES.TABS.JOURNEY);
    }
  }, [mood?.today, journey, handleCheckIn]);

  const resumeJourney = useCallback(() => {
    router.push(ROUTES.JOURNEY.HOME);
  }, []);

  const handleMissionPress = useCallback(() => {
    if (mission?.lessonId) {
      router.push(
        buildRoute(ROUTES.JOURNEY.LESSON, {
          programId: mission.programId ?? journey?.current_program_id ?? '',
          lessonId: mission.lessonId,
        }),
      );
      return;
    }
    if (mission) {
      void missionService
        .completeMission(mission.id)
        .then(() => void queryClient.invalidateQueries({ queryKey: HOME_STATE_QUERY_KEY }))
        .catch((err) => console.error('[HomeScreen] mission complete error:', err));
    } else {
      resumeJourney();
    }
  }, [mission, journey, queryClient, resumeJourney]);

  const handleSaveReflection = useCallback(async () => {
    if (!reflectionNote.trim()) return;
    setIsSavingReflection(true);
    try {
      await journalService.create({
        title: `Reflection — ${new Date().toLocaleDateString()}`,
        body: reflectionNote,
      });
      setReflectionNote('');
      void queryClient.invalidateQueries({ queryKey: HOME_STATE_QUERY_KEY });
    } catch (err) {
      console.error('[HomeScreen] Reflection save error:', err);
    } finally {
      setIsSavingReflection(false);
    }
  }, [reflectionNote, queryClient]);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: HOME_STATE_QUERY_KEY });
  }, [queryClient]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await processQueue(queryClient);
      if (uid) {
        void moodRepository.syncFromCloud(uid).then((merged) => {
          if (merged.length > 0) {
            queryClient.setQueryData(['moods', uid], merged);
          }
        });
      }
      await queryClient.invalidateQueries({ queryKey: HOME_STATE_QUERY_KEY });
    } catch (err) {
      console.error('[HomeScreen] Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [uid, queryClient, processQueue]);

  const handleNotificationPress = useCallback(() => {
    console.log('[HomeScreen] Navigate to notification center');
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background.primary }]}
      edges={['top']}
    >
      <StatusBar style="light" />

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
        {/* ── 1. Top bar ──────────────────────────────────────────────────── */}
        <HomeHeader
          onNotificationPress={handleNotificationPress}
          unreadCount={notifications?.unreadCount ?? 0}
        />

        {/* ── Sync Banner (non-intrusive, only when pending) ──────────────── */}
        {pendingQueue.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[
              styles.syncBanner,
              { backgroundColor: colors.surface.secondary, borderColor: colors.border.default },
            ]}
          >
            <View style={styles.syncBannerContent}>
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.brand.primary} style={{ marginRight: 8 }} />
              ) : (
                <View style={[styles.syncStatusDot, { backgroundColor: isOnline ? colors.success : colors.warning }]} />
              )}
              <Text style={[styles.syncBannerText, { color: colors.text.secondary }]}>
                {isSyncing
                  ? 'Syncing changes...'
                  : !isOnline
                  ? `Offline · ${pendingQueue.length} pending`
                  : lastError
                  ? 'Sync failed. Tap to retry.'
                  : `${pendingQueue.length} update${pendingQueue.length === 1 ? '' : 's'} pending`}
              </Text>
            </View>
            {isOnline && !isSyncing && (
              <Text
                style={[styles.retryButton, { color: colors.brand.primary }]}
                onPress={() => void processQueue(queryClient)}
              >
                Sync now
              </Text>
            )}
          </Animated.View>
        )}

        {/* ── 2. Hero Card ─────────────────────────────────────────────────── */}
        <HeroCard
          headline={greeting?.adaptive?.headline ?? greeting?.text ?? 'Welcome back'}
          subline={greeting?.adaptive?.subline ?? "Here's your day at a glance."}
          ctaLabel={greeting?.adaptive?.ctaLabel ?? 'Continue'}
          streak={mood?.streak ?? 0}
          dayCount={mood?.dayCount ?? 0}
          moment={greeting?.moment ?? 'default'}
          hasCheckedInToday={!!mood?.today}
          onCtaPress={handleHeroCta}
        />

        {/* ── 3. Quick Actions ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <QuickActionsBar
            onOpenChat={() => router.push(ROUTES.TABS.CHAT)}
          />
        </View>

        {/* ── 4. Two-column medium row: Journey + Today's Mission ─────────── */}
        <View style={[styles.section, styles.twoCol]}>
          {isLoading ? (
            <JourneyLoadingState />
          ) : error ? (
            <JourneyErrorState onRetry={refresh} />
          ) : !journey ? (
            <EmptyJourneyState onStart={() => router.push(ROUTES.TABS.JOURNEY)} />
          ) : (
            <>
              <ContinueJourneyCard
                title={journey.title}
                currentStep={1}
                totalSteps={10}
                percent={0}
                onContinue={resumeJourney}
              />
              <TodaysMissionCard
                missionTitle={mission?.title ?? journey.title}
                missionDescription={mission?.description ?? journey.description ?? undefined}
                onPress={handleMissionPress}
              />
            </>
          )}
        </View>

        {/* ── 5. Reflection (Journal) ─────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Reflection" />
          {reflection?.reflectedToday && reflection.latest ? (
            <View
              style={[
                styles.reflectionCard,
                { backgroundColor: colors.surface.secondary, borderColor: colors.border.default },
              ]}
            >
              <Text style={[styles.reflectionEyebrow, { color: colors.brand.primary }]}>
                You reflected today ✨
              </Text>
              <Text style={[styles.reflectionBody, { color: colors.text.primary }]} numberOfLines={4}>
                {reflection.latest.body ?? reflection.latest.title}
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.reflectionPrompt, { color: colors.text.secondary }]}>
                Take a moment to capture a thought or feeling.
              </Text>
              <ReflectionInput value={reflectionNote} onChangeText={setReflectionNote} />
              <View style={styles.submitRow}>
                <Text
                  style={[
                    styles.submitButton,
                    { backgroundColor: colors.brand.primary, color: colors.brand.contrastText },
                  ]}
                  onPress={() => void handleSaveReflection()}
                >
                  {isSavingReflection ? 'Saving…' : 'Save reflection'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ── 6. Compact Mood Timeline ─────────────────────────────────────── */}
        <View style={styles.section}>
          <WeeklyHistoryCard
            moodEntries={mood?.entries ?? []}
            onCheckIn={handleCheckIn}
          />
        </View>

        {/* ── 7. Smart Recommendation ──────────────────────────────────────── */}
        {recommendation?.primary && recommendation?.reason && (
          <View style={styles.section}>
            <SmartRecommendationCard
              reason={recommendation.reason}
              title={recommendation.primary.reason ?? recommendation.primary.source ?? 'Try something new'}
              subtitle={
                recommendation.primary.source !== recommendation.primary.reason
                  ? recommendation.primary.source
                  : undefined
              }
              onPress={() => console.log('[HomeScreen] Recommendation tapped')}
            />
          </View>
        )}

        {/* ── 8. Progress ───────────────────────────────────────────────────── */}
        {progress && (progress.completedLessons > 0 || progress.completedExercises > 0) && (
          <View style={styles.section}>
            <SectionHeader title="Your progress" />
            <View style={[styles.progressRow, { backgroundColor: colors.surface.secondary, borderColor: colors.border.default }]}>
              <View style={styles.progressStat}>
                <Text style={[styles.progressValue, { color: colors.text.primary }]}>
                  {progress.completedLessons}
                </Text>
                <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>Lessons</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressValue, { color: colors.text.primary }]}>
                  {progress.completedExercises}
                </Text>
                <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>Exercises</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressValue, { color: colors.text.primary }]}>
                  {progress.streakDays}
                </Text>
                <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>Day streak</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── 9. Mood Check-in Flow ─────────────────────────────────────────── */}
        {showSelector && !mood?.today && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.section}
          >
            <SectionHeader title="How are you feeling today?" />
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={handleSelectMood}
            />
            {selectedMood !== null && (
              <View
                style={[
                  styles.submitContainer,
                  { backgroundColor: colors.surface.secondary, borderColor: colors.border.default },
                ]}
              >
                <Text style={[styles.submitText, { color: colors.text.secondary }]}>
                  You selected: {MOOD_MAP[selectedMood].emoji} {MOOD_MAP[selectedMood].label} — ready to check in?
                </Text>
                <ReflectionInput value={reflectionNote} onChangeText={setReflectionNote} />
                <View style={styles.submitRow}>
                  <Text
                    style={[
                      styles.submitButton,
                      { backgroundColor: colors.brand.primary, color: colors.brand.contrastText },
                    ]}
                    onPress={handleSubmitMood}
                  >
                    {saveMoodMutation.isPending ? 'Saving…' : 'Save check-in'}
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── Success toast ────────────────────────────────────────────────── */}
        {isSuccess && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[
              styles.successCard,
              { backgroundColor: `${colors.success}1A`, borderColor: `${colors.success}33` },
            ]}
          >
            <Text style={[styles.successText, { color: colors.success }]}>
              ✓ Checked in! Great work today.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B12',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginTop: 16,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },

  // Sync banner
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  syncBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  syncBannerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  retryButton: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // Reflection
  reflectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  reflectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  reflectionBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  reflectionPrompt: {
    fontSize: 13,
    marginBottom: 8,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 11,
    marginTop: 2,
  },

  // Check-in
  submitContainer: {
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  submitText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  submitRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  submitButton: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Success
  successCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
