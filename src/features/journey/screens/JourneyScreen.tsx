/**
 * JourneyScreen — Guided Progression System
 *
 * This is NOT a content library.
 * This is a guided progression system.
 * Think less like Netflix. Think more like Duolingo.
 *
 * Information Hierarchy (strict priority order):
 *  1. Header — Identity + streak
 *  2. JourneyHero — Motivation + stats
 *  3. Continue Current Journey — Primary action
 *  4. Explore Practices — Secondary discovery
 *  5. Recommended Activities — Personalised suggestion
 *  6. Your Progress — Weekly accountability
 *
 * Every section has a reason to exist.
 */

import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Brain, Wind, Sparkles, Leaf } from 'lucide-react-native';

import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/shared/hooks/useAuth';
import { useActiveJourney } from '@/features/journey/hooks/useActiveJourney';
import { spacing } from '@/core/theme';

import {
  JourneyHeader,
  JourneyHero,
  JourneySectionHeader,
  CurrentProgramCard,
  PracticeCategoryCard,
  RecommendationCard,
  WeeklyProgressTracker,
} from '../components';

// ── Practice categories data ───────────────────────────────────────────────

const PRACTICE_CATEGORIES = [
  {
    id: 'cbt',
    title: 'CBT Exercises',
    description: 'Reframe thoughts and build skills',
    countLabel: '8 Lessons',
    accentColor: '#6C4CF1',
    iconType: 'brain' as const,
  },
  {
    id: 'breathing',
    title: 'Breathing',
    description: 'Reduce stress and relax',
    countLabel: '6 Sessions',
    accentColor: '#06B6D4',
    iconType: 'wind' as const,
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Mindfulness made simple',
    countLabel: '12 Sessions',
    accentColor: '#8B5CF6',
    iconType: 'sparkles' as const,
  },
  {
    id: 'wellness',
    title: 'Wellness Studio',
    description: 'Tools for everyday well-being',
    countLabel: '9 Tools',
    accentColor: '#10B981',
    iconType: 'leaf' as const,
  },
];

function getCategoryIcon(type: string, color: string) {
  const size = 24;
  switch (type) {
    case 'brain': return <Brain size={size} color={color} />;
    case 'wind': return <Wind size={size} color={color} />;
    case 'sparkles': return <Sparkles size={size} color={color} />;
    case 'leaf': return <Leaf size={size} color={color} />;
    default: return <Sparkles size={size} color={color} />;
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export function JourneyScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const uid = user?.uid || null;
  const [refreshing, setRefreshing] = useState(false);

  const displayName = useMemo(() => {
    const name = (user as any)?.name || (user as any)?.displayName || '';
    if (!name || name === 'User') return '';
    return name.split(' ')[0];
  }, [user]);

  const {
    data: journey,
    resumeJourney,
    refetchJourney,
  } = useActiveJourney(uid);

  // ── Handlers ───────────────────────────────────────────────────────────

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchJourney();
    } catch (error) {
      console.error('[JourneyScreen] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchJourney]);

  const handleContinue = useCallback(() => {
    if (journey) {
      resumeJourney(journey);
    }
  }, [journey, resumeJourney]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    console.log(`[JourneyScreen] Category tapped: ${categoryId}`);
  }, []);

  const handleRecommendationStart = useCallback(() => {
    console.log('[JourneyScreen] Recommendation start tapped');
  }, []);

  const handleViewAll = useCallback(() => {
    console.log('[JourneyScreen] View all tapped');
  }, []);

  const handleRefreshRecommendation = useCallback(() => {
    console.log('[JourneyScreen] Refresh recommendation tapped');
  }, []);

  // ── Mock data (will be replaced by backend) ────────────────────────────

  const streak = 6;
  const weeklyProgress = 62;
  const exercisesCompleted = 12;

  // ── Render ─────────────────────────────────────────────────────────────

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
        {/* ── 1. Header ─────────────────────────────────────────── */}
        <JourneyHeader streak={streak} />

        {/* ── 2. JourneyHero ────────────────────────────────────── */}
        <JourneyHero
          firstName={displayName}
          weeklyProgress={weeklyProgress}
          exercisesCompleted={exercisesCompleted}
        />

        {/* ── 3. Continue Current Journey (HIGHEST PRIORITY) ──── */}
        <View style={styles.sectionSpacing}>
          <JourneySectionHeader
            title="Continue where you left off"
            actionText="View all"
            onActionPress={handleViewAll}
          />
          <View style={styles.cardPadding}>
            <CurrentProgramCard
              title={journey?.title || 'Managing Overthinking'}
              currentLesson={journey?.currentLesson || 3}
              totalLessons={journey?.totalLessons || 8}
              completionPercent={journey?.completionPercent || 37}
              minutesRemaining={8}
              category="CBT PROGRAM"
              onContinue={handleContinue}
            />
          </View>
        </View>

        {/* ── 4. Explore Practices ───────────────────────────── */}
        <View style={styles.sectionSpacing}>
          <JourneySectionHeader
            title="Explore practices"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {PRACTICE_CATEGORIES.map((cat, idx) => (
              <View key={cat.id} style={idx < PRACTICE_CATEGORIES.length - 1 ? styles.categoryGap : undefined}>
                <PracticeCategoryCard
                  icon={getCategoryIcon(cat.iconType, cat.accentColor)}
                  title={cat.title}
                  description={cat.description}
                  countLabel={cat.countLabel}
                  accentColor={cat.accentColor}
                  width={140}
                  animationDelay={240 + idx * 60}
                  onPress={() => handleCategoryPress(cat.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── 5. Recommended Activities ──────────────────────── */}
        <View style={styles.sectionSpacing}>
          <JourneySectionHeader
            title="Recommended for you today"
            actionText="Refresh ↻"
            onActionPress={handleRefreshRecommendation}
          />
          <View style={styles.cardPadding}>
            <RecommendationCard
              title="5-Minute Breathing Space"
              description="Start your day with calm and clarity."
              category="MORNING RESET"
              categoryColor="#F97316"
              durationMinutes={5}
              onStart={handleRecommendationStart}
            />
          </View>
        </View>

        {/* ── 6. Your Progress ───────────────────────────────── */}
        <View style={styles.sectionSpacing}>
          <JourneySectionHeader
            title="Your progress"
            actionText="This week ▾"
          />
          <View style={styles.cardPadding}>
            <WeeklyProgressTracker
              activeDays={3}
            />
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
    paddingBottom: 110,
    paddingHorizontal: spacing.xl,
  },
  sectionSpacing: {
    marginTop: spacing['2xl'],
  },

  cardPadding: {
    // Cards already have their own padding
  },
  categoriesContainer: {
    paddingRight: spacing.xl,
  },
  categoryGap: {
    marginRight: spacing.md,
  },
});

export default JourneyScreen;
