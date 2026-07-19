/**
 * Velness — Dark Theme Tokens (DEEP LAVENDER NIGHT)
 *
 * Base #1a1327 (no pure black). Lavender undertones throughout.
 * Brand #cd9cf2 glows on the dark base; on-brand text uses the dark base.
 * Contrast tuned for WCAG AA.
 */

import type { ThemeTokens } from './light';

export const darkTheme: ThemeTokens = {
  background: {
    primary: '#1A1327',
    secondary: '#221936',
    tertiary: '#2B2142',
    elevated: '#2B2142',
  },
  surface: {
    primary: '#241A38',
    secondary: '#2C2143',
    tertiary: '#352850',
    card: '#2A1F40',
    elevated: '#322447',
  },
  text: {
    primary: '#F3EEFB',
    secondary: '#C9BCDD',
    tertiary: '#9A8CB4',
    inverse: '#1A1327',
    disabled: '#6E6288',
    muted: '#8A7CA8',
  },
  border: {
    subtle: 'rgba(205, 156, 242, 0.08)',
    default: 'rgba(205, 156, 242, 0.16)',
    strong: 'rgba(205, 156, 242, 0.28)',
    focus: '#CD9CF2',
  },
  glass: {
    highlight: 'rgba(255, 255, 255, 0.10)',
    light: 'rgba(255, 255, 255, 0.70)',
    medium: 'rgba(205, 156, 242, 0.18)',
    strong: 'rgba(205, 156, 242, 0.28)',
    tint: 'rgba(205, 156, 242, 0.10)',
    border: 'rgba(205, 156, 242, 0.30)',
  },
  brand: {
    primary: '#CD9CF2',
    primaryDeep: '#B98AED',
    secondary: '#9A78D0',
    tertiary: '#6E5A9A',
    onPrimary: '#1A1327',
    /** Backward-compatible alias for onPrimary (used by many components). */
    contrastText: '#1A1327',
    subtle: 'rgba(205, 156, 242, 0.16)',
    border: 'rgba(205, 156, 242, 0.45)',
  },
  overlay: {
    light: 'rgba(26, 19, 39, 0.45)',
    medium: 'rgba(26, 19, 39, 0.62)',
    strong: 'rgba(26, 19, 39, 0.78)',
    backdrop: 'rgba(26, 19, 39, 0.55)',
  },
  success: '#4FD08A',
  warning: '#F4C95B',
  danger: '#F58BA1',
  info: '#6FB6E8',
  successSubtle: 'rgba(79, 208, 138, 0.14)',
  warningSubtle: 'rgba(244, 201, 91, 0.14)',
  dangerSubtle: 'rgba(245, 139, 161, 0.14)',
  infoSubtle: 'rgba(111, 182, 232, 0.14)',
  successText: '#9FE7C2',
  warningText: '#FBE3A0',
  dangerText: '#FBC3D0',
  infoText: '#BFE0F6',
  mood: {
    calm: '#7CC0E0',
    good: '#74C9A8',
    great: '#B99BE8',
    notGood: '#E7A982',
    overwhelmed: '#E0A0B8',
    happy: '#F0C96E',
    sad: '#93B0E6',
    anxious: '#E0B0D0',
    grateful: '#A6D8B0',
    reflective: '#B0A2E8',
    energized: '#E8B084',
  },
  moodScale: {
    1: '#E0A0B8',
    2: '#E7A982',
    3: '#9AAAB8',
    4: '#B99BE8',
    5: '#74C9A8',
  },
};
