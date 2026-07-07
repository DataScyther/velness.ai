/**
 * Repository Layer — public API
 *
 * Single import surface for the Supabase-backed repositories. UI/feature code
 * must import repositories from here (or individual files) and NEVER touch the
 * Supabase client directly (Sprint S0.5 rule).
 */

import {
  BaseRepository,
  RepositoryError,
  toRepositoryError,
  type AppTables,
  type TableName,
  type AuthUser,
  type AuthSession,
  type AuthSubscription,
  type AuthErrorType,
} from './baseRepository';

import {
  AuthRepository,
  authRepository,
  type OAuthProvider,
  type AuthChangeEvent,
  type AuthStateCallback,
} from './AuthRepository';

import {
  ProfileRepository,
  profileRepository,
  type ProfilePatch,
} from './ProfileRepository';

import {
  JourneyRepository,
  journeyRepository,
  type JourneyInput,
  type JourneyPatch,
} from './JourneyRepository';

import {
  MoodRepository,
  moodRepository,
  type MoodInput,
  type MoodPatch,
} from './MoodRepository';

import {
  SessionRepository,
  sessionRepository,
  type SessionInput,
  type SessionPatch,
} from './SessionRepository';

import {
  RecommendationRepository,
  recommendationRepository,
  type RecommendationInput,
  type RecommendationPatch,
} from './RecommendationRepository';

import { ExerciseRepository, exerciseRepository } from './ExerciseRepository';

import {
  ProgramRepository,
  programRepository,
  type ProgramInput,
  type ProgramPatch,
} from './ProgramRepository';

import {
  LessonRepository,
  lessonRepository,
  type LessonInput,
  type LessonPatch,
} from './LessonRepository';

import {
  ProgressRepository,
  progressRepository,
  type ProgressInput,
  type ProgressPatch,
} from './ProgressRepository';

import {
  AchievementRepository,
  achievementRepository,
  type AchievementInput,
  type AchievementPatch,
} from './AchievementRepository';

import {
  JournalRepository,
  journalRepository,
  type JournalInput,
  type JournalPatch,
} from './JournalRepository';

import {
  NotificationRepository,
  notificationRepository,
  type NotificationInput,
  type NotificationPatch,
} from './NotificationRepository';

import {
  UserPreferencesRepository,
  userPreferencesRepository,
  type PreferencesInput,
  type PreferencesPatch,
} from './UserPreferencesRepository';

import {
  AnalyticsRepository,
  analyticsRepository,
  type AnalyticsEventInput,
} from './AnalyticsRepository';

// ── Re-exports ─────────────────────────────────────────────────────────────
export {
  BaseRepository,
  RepositoryError,
  toRepositoryError,
  type AppTables,
  type TableName,
  type AuthUser,
  type AuthSession,
  type AuthSubscription,
  type AuthErrorType,
  AuthRepository,
  authRepository,
  type OAuthProvider,
  type AuthChangeEvent,
  type AuthStateCallback,
  ProfileRepository,
  profileRepository,
  type ProfilePatch,
  JourneyRepository,
  journeyRepository,
  type JourneyInput,
  type JourneyPatch,
  MoodRepository,
  moodRepository,
  type MoodInput,
  type MoodPatch,
  SessionRepository,
  sessionRepository,
  type SessionInput,
  type SessionPatch,
  RecommendationRepository,
  recommendationRepository,
  type RecommendationInput,
  type RecommendationPatch,
  ExerciseRepository,
  exerciseRepository,
  ProgramRepository,
  programRepository,
  type ProgramInput,
  type ProgramPatch,
  LessonRepository,
  lessonRepository,
  type LessonInput,
  type LessonPatch,
  ProgressRepository,
  progressRepository,
  type ProgressInput,
  type ProgressPatch,
  AchievementRepository,
  achievementRepository,
  type AchievementInput,
  type AchievementPatch,
  JournalRepository,
  journalRepository,
  type JournalInput,
  type JournalPatch,
  NotificationRepository,
  notificationRepository,
  type NotificationInput,
  type NotificationPatch,
  UserPreferencesRepository,
  userPreferencesRepository,
  type PreferencesInput,
  type PreferencesPatch,
  AnalyticsRepository,
  analyticsRepository,
  type AnalyticsEventInput,
};

// ── Convenience namespace ──────────────────────────────────────────────────
/** Bundles every repository instance for convenient `repositories.auth.getSession()` style imports. */
export const repositories = {
  auth: authRepository,
  profile: profileRepository,
  journey: journeyRepository,
  mood: moodRepository,
  session: sessionRepository,
  recommendation: recommendationRepository,
  exercise: exerciseRepository,
  program: programRepository,
  lesson: lessonRepository,
  progress: progressRepository,
  achievement: achievementRepository,
  journal: journalRepository,
  notification: notificationRepository,
  userPreferences: userPreferencesRepository,
  analytics: analyticsRepository,
} as const;

export default repositories;
