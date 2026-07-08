// src/features/home/services/HomeState.ts
//
// The single, typed shape returned by HomeService.fetchHomeState().
// Every section the Home screen renders is represented here so HomeScreen
// becomes a pure projection of this object.

import type { NarrativeMoment, AdaptiveContent } from './HomeViewModel';
import type { Mood } from '@/shared/types';

import type { JourneyRow } from '../../../../backend/services/JourneyService';
import type { RecommendationRow } from '../../../../backend/services/RecommendationService';
import type { ProgressRow } from '../../../../backend/services/ProgressService';
import type { NotificationRow } from '../../../../backend/services/NotificationService';
import type { JournalRow } from '../../../../backend/services/JournalService';
import type { MissionRow } from '../../../../backend/services/MissionService';

export interface GreetingSection {
  text: string;
  firstName: string | null;
  moment: NarrativeMoment;
  adaptive: AdaptiveContent;
}

export interface TodaysMissionSection {
  id: string;
  title: string;
  description: string | null;
  source: string;
  status: string;
  programId: string | null;
  lessonId: string | null;
}

export interface ReflectionSection {
  latest: JournalRow | null;
  reflectedToday: boolean;
}

export interface MoodSection {
  today: Mood | null;
  entries: Mood[];
  streak: number;
  dayCount: number;
}

export interface RecommendationSection {
  primary: RecommendationRow | null;
  all: RecommendationRow[];
  reason: string | null;
}

export interface ProgressSummary {
  rows: ProgressRow[];
  completedLessons: number;
  completedExercises: number;
  completedPrograms: number;
  streakDays: number;
}

export interface NotificationsSection {
  items: NotificationRow[];
  unreadCount: number;
}

/** The full Home Intelligence Layer state. */
export interface HomeState {
  greeting: GreetingSection;
  todaysMission: TodaysMissionSection | null;
  journey: JourneyRow | null;
  reflection: ReflectionSection;
  mood: MoodSection;
  recommendation: RecommendationSection;
  progress: ProgressSummary;
  notifications: NotificationsSection;
}

export type { MissionRow };
