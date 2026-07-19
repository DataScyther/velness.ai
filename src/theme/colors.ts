/**
 * Velness Design System — Color Palette
 *
 * `light` / `dark` are the semantic ThemeTokens used by ThemeProvider and
 * Tailwind. `palette` holds the raw brand ramps (purple / cyan / glass /
 * surface / status) referenced by a few feature files for fine-grained
 * accent work. All ramps are derived from the lavender brand system.
 *
 * Dark theme is no longer the default — light is the primary theme.
 */

export { lightTheme as light } from './light';
export { darkTheme as dark } from './dark';
export type { ThemeTokens } from './light';

import { lightTheme } from './light';
import { darkTheme } from './dark';

/** Raw brand ramps (fine-grained accents). */
export const palette = {
  purple: {
    50: '#F6F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C9A8F0',
    400: '#A878E0',
    500: '#8A5FC7',
    600: '#7A4FB8',
    700: '#6A3FA8',
    800: '#5A2F98',
    900: '#4A1F88',
  },
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    medium: 'rgba(246, 243, 255, 0.55)',
    dark: 'rgba(26, 19, 39, 0.7)',
    border: 'rgba(205, 156, 242, 0.30)',
    highlight: 'rgba(205, 156, 242, 0.10)',
  },
  surface: {
    dark: '#1A1327',
    light: '#F6F3FF',
    card: '#2A1F40',
    elevated: '#322447',
  },
  text: {
    primary: '#2A1B47',
    secondary: '#4A3A6B',
    tertiary: '#6E5F8E',
    accent: '#A878E0',
    link: '#1F6FB0',
  },
  status: {
    success: '#1F8A4D',
    warning: '#9A6512',
    error: '#C12A4B',
    info: '#1F6FB0',
  },
} as const;

export const colors = {
  light: lightTheme,
  dark: darkTheme,
  /** Backward-compatible ramps (formerly core/theme/colors.ts). */
  purple: palette.purple,
  cyan: palette.cyan,
} as const;

export type ColorKey = keyof typeof colors;
