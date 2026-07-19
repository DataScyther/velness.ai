/**
 * Velness — Light Theme Tokens (PRIMARY THEME)
 *
 * Lavender companion aesthetic. Background wash #f6f3ff, brand #cd9cf2.
 * `primary` (#a878e0) is used for fills; `primaryDeep` (#8a5fc7) is used
 * wherever brand color sits under text/icon on a light surface (AA-safe).
 * `#cd9cf2` is reserved for decorative gradients only.
 * Contrast tuned for WCAG AA on every text/surface pairing.
 */

export interface ThemeTokens {
  background: { primary: string; secondary: string; tertiary: string; elevated: string };
  surface: { primary: string; secondary: string; tertiary: string; card: string; elevated: string };
  text: { primary: string; secondary: string; tertiary: string; inverse: string; disabled: string; muted: string };
  border: { subtle: string; default: string; strong: string; focus: string };
  glass: { highlight: string; light: string; medium: string; strong: string; tint: string; border: string };
  brand: {
    primary: string;        // decorative / gradient fill
    primaryDeep: string;    // icons + text on light surfaces
    secondary: string;
    tertiary: string;
    onPrimary: string;       // text drawn on brand fills
    /** Backward-compatible alias for onPrimary (used by many components). */
    contrastText: string;
    subtle: string;          // tinted fill behind brand chips
    border: string;          // brand outline tint
  };
  overlay: { light: string; medium: string; strong: string; backdrop: string };
  success: string; warning: string; danger: string; info: string;
  successSubtle: string; warningSubtle: string; dangerSubtle: string; infoSubtle: string;
  successText: string; warningText: string; dangerText: string; infoText: string;
  mood: {
    calm: string; good: string; great: string; notGood: string; overwhelmed: string;
    happy: string; sad: string; anxious: string; grateful: string; reflective: string; energized: string;
  };
  moodScale: {
    1: string; 2: string; 3: string; 4: string; 5: string;
  };
}

export const lightTheme: ThemeTokens = {
  background: {
    primary: '#F6F3FF',
    secondary: '#EFEAFB',
    tertiary: '#E4DCF6',
    elevated: '#FFFFFF',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F7F3FE',
    tertiary: '#F0EAFB',
    card: '#FBF9FF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#2A1B47',
    secondary: '#4A3A6B',
    tertiary: '#6E5F8E',
    inverse: '#F6F3FF',
    disabled: '#9A8CB4',
    muted: '#8A7CA8',
  },
  border: {
    subtle: '#ECE6F7',
    default: '#DDD3EF',
    strong: '#C7B9E4',
    focus: '#A878E0',
  },
  glass: {
    highlight: 'rgba(255, 255, 255, 0.65)',
    light: 'rgba(255, 255, 255, 0.72)',
    medium: 'rgba(246, 243, 255, 0.55)',
    strong: 'rgba(246, 243, 255, 0.80)',
    tint: 'rgba(205, 156, 242, 0.10)',
    border: 'rgba(205, 156, 242, 0.35)',
  },
  brand: {
    primary: '#A878E0',
    primaryDeep: '#8A5FC7',
    secondary: '#C9A8F0',
    tertiary: '#E3D2F7',
    onPrimary: '#FFFFFF',
    /** Backward-compatible alias for onPrimary (used by many components). */
    contrastText: '#FFFFFF',
    subtle: 'rgba(168, 120, 224, 0.12)',
    border: 'rgba(168, 120, 224, 0.40)',
  },
  overlay: {
    light: 'rgba(42, 27, 71, 0.25)',
    medium: 'rgba(42, 27, 71, 0.45)',
    strong: 'rgba(42, 27, 71, 0.62)',
    backdrop: 'rgba(246, 243, 255, 0.60)',
  },
  success: '#1F8A4D',
  warning: '#9A6512',
  danger: '#C12A4B',
  info: '#1F6FB0',
  successSubtle: 'rgba(31, 138, 77, 0.12)',
  warningSubtle: 'rgba(154, 101, 18, 0.12)',
  dangerSubtle: 'rgba(193, 42, 75, 0.12)',
  infoSubtle: 'rgba(31, 111, 176, 0.12)',
  successText: '#166B3A',
  warningText: '#7A4E0C',
  dangerText: '#9B1F3C',
  infoText: '#155A93',
  mood: {
    calm: '#5BA3C9',
    good: '#4FAE8B',
    great: '#9A78D0',
    notGood: '#D98A5B',
    overwhelmed: '#C76B8E',
    happy: '#E0A93B',
    sad: '#6B8FD6',
    anxious: '#C98AB0',
    grateful: '#7FB98A',
    reflective: '#8A7BD0',
    energized: '#D98C5B',
  },
  moodScale: {
    1: '#C76B8E',
    2: '#D98A5B',
    3: '#7E8E9F',
    4: '#9A78D0',
    5: '#4FAE8B',
  },
};
