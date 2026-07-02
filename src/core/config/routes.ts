/**
 * Neeva AI — Route Constants
 *
 * Centralised route names for Expo Router navigation.
 * Prevents hardcoded strings across the codebase.
 */

export const ROUTES = {
  // ─── Auth ───────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ONBOARDING: '/onboarding',
  } as const,

  // ─── Tabs ───────────────────────────────────────────────────────────
  TABS: {
    HOME: '/(tabs)',
    CHAT: '/(tabs)/chat',
    JOURNEY: '/(tabs)/journey',
    COMMUNITY: '/(tabs)/community',
    PROFILE: '/(tabs)/profile',
  } as const,

  // ─── Feature (future) ───────────────────────────────────────────────
  FEATURES: {
    MOOD_CHECKIN: '/mood/checkin',
    CBT_EXERCISE: '/journey/cbt/:id',
    MEDITATION: '/journey/meditation/:id',
    BREATHING: '/journey/breathing/:id',
    REFLECTION: '/journey/reflection',
    // Removed: CHAT_CONVERSATION — unified into single chat screen per Phase 1
    PROFILE_SETTINGS: '/profile/settings',
    PROFILE_SUBSCRIPTION: '/profile/subscription',
    PROFILE_NOTIFICATIONS: '/profile/notifications',
    PROFILE_SECURITY: '/profile/security',
  } as const,
} as const;

export type RouteName = keyof typeof ROUTES;
export type TabRoute = keyof typeof ROUTES.TABS;
export type AuthRoute = keyof typeof ROUTES.AUTH;
