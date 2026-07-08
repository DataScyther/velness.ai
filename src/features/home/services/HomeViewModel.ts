// src/features/home/services/HomeViewModel.ts
//
// Single aggregation point for the Home screen.
// HomeScreen → useHomeViewModel → HomeViewModel → [services] → Supabase
//
// Rules:
//  - No UI imports here. Pure async data.
//  - All derived fields (greeting, streak, narrativeMoment) are computed here
//    so HomeScreen is 100% presentational.

import { moodService } from '../../../../backend/services/MoodService';
import { journeyService } from '../../../../backend/services/JourneyService';
import { recommendationService } from '../../../../backend/services/RecommendationService';
import { analyticsService } from '../../../../backend/services/AnalyticsService';
import { profileService } from '../../../../backend/services/ProfileService';

import type { MoodRow } from '../../../../backend/services/MoodService';
import type { JourneyRow } from '../../../../backend/services/JourneyService';
import type { RecommendationRow } from '../../../../backend/services/RecommendationService';
import type { AnalyticsRow } from '../../../../backend/services/AnalyticsService';
import type { ProfileRow } from '../../../../backend/services/ProfileService';

import type { Mood, MoodRating } from '@/shared/types';

// ─── Narrative Moment ─────────────────────────────────────────────────────────

export type NarrativeMoment =
  | 'morning_fresh'    // <10am, no check-in yet
  | 'afternoon_active' // 10am–5pm
  | 'evening_wind_down'// ≥5pm
  | 'post_lesson'      // completed a lesson today
  | 'missed_days'      // no check-in for 2+ days
  | 'streak_active'    // 3+ day streak
  | 'default';

export interface AdaptiveContent {
  headline: string;
  subline: string;
  ctaLabel: string;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

const LEVEL_TO_RATING: Record<string, MoodRating> = {
  very_low: 1,
  low: 2,
  neutral: 3,
  good: 4,
  great: 5,
};

function moodRowToMood(row: MoodRow): Mood {
  return {
    id: row.id,
    rating: (LEVEL_TO_RATING[row.level] ?? 3) as MoodRating,
    note: row.note ?? '',
    timestamp: new Date(row.recorded_at ?? row.created_at),
  };
}

// ─── Shape ────────────────────────────────────────────────────────────────────

export type HomeScreenData = {
  // Derived display
  greeting: string;
  dayCount: number;
  streak: number;
  narrativeMoment: NarrativeMoment;
  adaptiveContent: AdaptiveContent;
  recommendationReason: string | null;

  // Mood
  todayMood: Mood | null;
  moodEntries: Mood[];

  // Journey
  journey: JourneyRow | null;

  // Data
  recommendations: RecommendationRow[];
  recentEvents: AnalyticsRow[];
  profile: ProfileRow | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFirstName(profile: ProfileRow | null): string | null {
  if (!profile) return null;
  const name = profile.display_name || profile.username;
  if (!name) return null;
  return name.split(' ')[0];
}

function buildGreeting(profile: ProfileRow | null): string {
  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = getFirstName(profile);
  return firstName ? `${salutation}, ${firstName}` : salutation;
}

function calcDayCount(profile: ProfileRow | null): number {
  if (!profile?.created_at) return 0;
  return Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
}

function calcStreak(entries: Mood[]): number {
  if (entries.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 365; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = day.toDateString();
    const hasEntry = entries.some(
      (e) => new Date(e.timestamp).toDateString() === dayStr,
    );
    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      // Allow today to be incomplete; only break on past days
      break;
    }
  }
  return streak;
}

function calcDaysSinceLastCheckIn(entries: Mood[]): number {
  if (entries.length === 0) return 999;
  const last = entries.reduce((a, b) =>
    new Date(a.timestamp) > new Date(b.timestamp) ? a : b,
  );
  const diffMs = Date.now() - new Date(last.timestamp).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getTodayMood(entries: Mood[]): Mood | null {
  const todayStr = new Date().toDateString();
  const todayEntries = entries.filter(
    (e) => new Date(e.timestamp).toDateString() === todayStr,
  );
  return todayEntries.length > 0 ? todayEntries[todayEntries.length - 1] : null;
}

function deriveMoment(
  entries: Mood[],
  streak: number,
  daysSinceLast: number,
): NarrativeMoment {
  const hour = new Date().getHours();
  const hasCheckedInToday = !!getTodayMood(entries);

  if (daysSinceLast >= 2 && !hasCheckedInToday) return 'missed_days';
  if (streak >= 3) return 'streak_active';
  if (hour < 10 && !hasCheckedInToday) return 'morning_fresh';
  if (hour >= 17) return 'evening_wind_down';
  if (hour >= 10) return 'afternoon_active';
  return 'default';
}

function buildAdaptiveContent(
  moment: NarrativeMoment,
  firstName: string | null,
  streak: number,
  journeyTitle: string | null,
): AdaptiveContent {
  const name = firstName ?? 'there';

  const MAP: Record<NarrativeMoment, AdaptiveContent> = {
    morning_fresh: {
      headline: `Good morning, ${name} 🌤`,
      subline: 'Ready to start today?',
      ctaLabel: 'Begin check-in',
    },
    afternoon_active: {
      headline: `Hey, ${name} 👋`,
      subline: journeyTitle
        ? `Continue: ${journeyTitle}`
        : "Let's keep the momentum going.",
      ctaLabel: 'Continue journey',
    },
    evening_wind_down: {
      headline: `Good evening, ${name} 🌙`,
      subline: "Let's slow down and reflect.",
      ctaLabel: 'Reflect now',
    },
    post_lesson: {
      headline: `Nice work, ${name} 🎉`,
      subline: 'One more lesson unlocks tomorrow.',
      ctaLabel: 'See progress',
    },
    missed_days: {
      headline: `Welcome back, ${name} 🤍`,
      subline: "Let's restart gently. No pressure.",
      ctaLabel: 'Check in now',
    },
    streak_active: {
      headline: `Day ${streak} 🔥`,
      subline: "You're building something real.",
      ctaLabel: 'Keep going',
    },
    default: {
      headline: `Hello, ${name} 👋`,
      subline: "Here's your day at a glance.",
      ctaLabel: 'Continue',
    },
  };

  return MAP[moment];
}

// ─── ViewModel ────────────────────────────────────────────────────────────────

class HomeViewModel {
  async getHomeScreenData(): Promise<HomeScreenData> {
    const [moodRows, journeys, recommendations, recentEvents, profile] =
      await Promise.all([
        moodService.list(30),
        journeyService.listByStatus('active'),
        recommendationService.list('pending'),
        analyticsService.list(50),
        profileService.getCurrent(),
      ]);

    const moodEntries = moodRows
      .map(moodRowToMood)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

    const journey = journeys[0] ?? null;
    const streak = calcStreak(moodEntries);
    const daysSinceLast = calcDaysSinceLastCheckIn(moodEntries);
    const firstName = getFirstName(profile);
    const narrativeMoment = deriveMoment(moodEntries, streak, daysSinceLast);
    const adaptiveContent = buildAdaptiveContent(
      narrativeMoment,
      firstName,
      streak,
      journey?.title ?? null,
    );

    // Build recommendation reason from journey context
    const recommendationReason = journey
      ? `Because you've been studying ${journey.title}`
      : recommendations.length > 0
      ? 'Based on your recent activity'
      : null;

    return {
      greeting: buildGreeting(profile),
      dayCount: calcDayCount(profile),
      streak,
      narrativeMoment,
      adaptiveContent,
      recommendationReason,
      todayMood: getTodayMood(moodEntries),
      moodEntries,
      journey,
      recommendations,
      recentEvents,
      profile,
    };
  }
}

export const homeViewModel = new HomeViewModel();
export default homeViewModel;
