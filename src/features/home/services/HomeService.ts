// src/features/home/services/HomeService.ts
//
// Home Intelligence Layer — the single aggregator for the Home screen.
//
//   HomeScreen → useHomeState → HomeService.fetchHomeState() → [services] → Supabase
//
// Composes the existing HomeViewModel (Greeting / Journey / Mood / Recommendation)
// with the remaining sections:
//   • Today's Mission  ← MissionService
//   • Reflection       ← JournalService
//   • Progress         ← ProgressService
//   • Notifications    ← NotificationService
//
// Each non-base fetch is isolated: a failure in one section never blanks the
// rest of the home.

import { homeViewModel } from './HomeViewModel';
import type {
  HomeState,
  TodaysMissionSection,
  ProgressSummary,
} from './HomeState';

import { missionService } from '../../../../backend/services/MissionService';
import { journalService } from '../../../../backend/services/JournalService';
import { progressService } from '../../../../backend/services/ProgressService';
import { notificationService } from '../../../../backend/services/NotificationService';

import type { MissionRow } from '../../../../backend/services/MissionService';
import type { JournalRow } from '../../../../backend/services/JournalService';
import type { ProgressRow } from '../../../../backend/services/ProgressService';
import type { NotificationRow } from '../../../../backend/services/NotificationService';
import type { ProfileRow } from '../../../../backend/services/ProfileService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve a single failed fetch to a safe fallback without breaking the rest. */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.error('[HomeService] isolated fetch failure:', err);
    return fallback;
  }
}

function getFirstName(profile: ProfileRow | null): string | null {
  if (!profile) return null;
  const name = profile.display_name || profile.username;
  return name ? name.split(' ')[0] : null;
}

function toMissionSection(row: MissionRow | null): TodaysMissionSection | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    source: row.source,
    status: row.status,
    programId: row.program_id ?? null,
    lessonId: row.lesson_id ?? null,
  };
}

function isToday(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

function deriveReflection(journals: JournalRow[]): HomeState['reflection'] {
  const latest = journals[0] ?? null;
  return {
    latest,
    reflectedToday: journals.some((j) => isToday(j.created_at)),
  };
}

function summarizeProgress(
  rows: ProgressRow[],
  streakDays: number,
): ProgressSummary {
  const completed = rows.filter((r) => r.status === 'completed');
  const lessonIds = new Set(completed.map((r) => r.lesson_id).filter(Boolean));
  const exerciseIds = new Set(completed.map((r) => r.exercise_id).filter(Boolean));
  const programIds = new Set(completed.map((r) => r.program_id).filter(Boolean));
  return {
    rows,
    completedLessons: lessonIds.size,
    completedExercises: exerciseIds.size,
    completedPrograms: programIds.size,
    streakDays,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

class HomeService {
  async fetchHomeState(): Promise<HomeState> {
    // Four sections come from the existing aggregator (kept intact).
    const base = await homeViewModel.getHomeScreenData();

    // Remaining sections — each isolated so one failure is contained.
    const [todaysMission, journals, progressRows, notifications] = await Promise.all([
      safe(missionService.ensureTodaysMission(), null),
      safe(journalService.list(), [] as JournalRow[]),
      safe(progressService.list(), [] as ProgressRow[]),
      safe(notificationService.list(true), [] as NotificationRow[]),
    ]);

    return {
      greeting: {
        text: base.greeting,
        firstName: getFirstName(base.profile),
        moment: base.narrativeMoment,
        adaptive: base.adaptiveContent,
      },
      todaysMission: toMissionSection(todaysMission),
      journey: base.journey,
      reflection: deriveReflection(journals),
      mood: {
        today: base.todayMood,
        entries: base.moodEntries,
        streak: base.streak,
        dayCount: base.dayCount,
      },
      recommendation: {
        primary: base.recommendations[0] ?? null,
        all: base.recommendations,
        reason: base.recommendationReason,
      },
      progress: summarizeProgress(progressRows, base.streak),
      notifications: {
        items: notifications,
        unreadCount: notifications.length,
      },
    };
  }
}

export const homeService = new HomeService();
export default homeService;
