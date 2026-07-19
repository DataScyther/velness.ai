// src/features/home/components/QuickActionsBar.tsx
//
// QuickActionsBar v2 — Five premium quick-action buttons.
//
// Design:
//   • 56×56 white circular containers (surface.primary)
//   • No gradients — solid surface only
//   • 1px subtle border, soft shadow (4-6% opacity)
//   • Lucide outline icons — 24px, 2px stroke, rounded caps
//   • Icon-only coloring (container stays white)
//   • 13px medium-weight labels
//   • 16px gap between buttons, 8px icon-to-label
//
// Press:  no scale/shadow/rotation on press — instant, crisp tap response
// Selected: soft purple outline ring (not solid fill)
//
// Icons (rendered via react-native-svg so they work on both web + native —
// the raw react-icons glyphs would crash on native because they emit HTML
// <svg>/<path> elements):
//   Breathe  → FaLeaf            (Cyan)    — react-icons/fa6
//   Journal  → IoIosJournal      (Violet)  — react-icons/io
//   Meditate → MdSelfImprovement (Amber)   — react-icons/md
//   Sleep    → GiNightSleep      (Indigo)  — react-icons/gi
//   AI Chat  → RiChatAi3Fill     (Emerald) — react-icons/ri

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

// ── Icon Glyphs (react-icons path data, rendered with react-native-svg) ───────

type IconGlyphChild =
  | { tag: 'path'; d: string; fill?: 'none' }
  | { tag: 'circle'; cx: string; cy: string; r: string };

interface IconGlyph {
  viewBox: string;
  children: IconGlyphChild[];
}

const GLYPHS = {
  leaf: {
    viewBox: '0 0 512 512',
    children: [
      {
        tag: 'path',
        d: 'M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z',
      },
    ],
  },
  journal: {
    viewBox: '0 0 512 512',
    children: [
      {
        tag: 'path',
        d: 'M92.1 32C76.6 32 64 44.6 64 60.1V452c0 15.5 12.6 28.1 28.1 28.1H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H112.5c-8.2 0-15.4-6-16.4-14.1-1.1-9.7 6.5-18 15.9-18h208V32H92.1z',
      },
      {
        tag: 'path',
        d: 'M432 416c8.8 0 16-7.2 16-16V60.1c0-15.5-12.6-28.1-28.1-28.1H368v384h64z',
      },
    ],
  },
  meditate: {
    viewBox: '0 0 24 24',
    children: [
      { tag: 'circle', cx: '12', cy: '6', r: '2' },
      {
        tag: 'path',
        d: 'M21 16v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79 0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25',
      },
    ],
  },
  sleep: {
    viewBox: '0 0 512 512',
    children: [
      {
        tag: 'path',
        d: 'M294.8 26.57L238 60.37l7.8 13.17L281 52.59 270.8 118l6.3 10.6L336 93.53l-7.8-13.17-37.3 22.14L301 37.12l-6.2-10.55zM147.1 60.55A224 224 0 0 0 32 256a224 224 0 0 0 224 224 224 224 0 0 0 214.9-161.2A208 208 0 0 1 320 384a208 208 0 0 1-208-208 208 208 0 0 1 35.1-115.45zm244.5 52.05l-6.9 16.5 44.1 18.4-68.3 35.9-5.5 13.2 73.7 30.8 6.9-16.5-46.7-19.5 68.3-35.9 5.5-13.2-71.1-29.7zm-115 64l-97.8 35 8.1 22.7 60.6-21.7-35.4 97.9 6.5 18.1L320 292.4l-8.1-22.7-64.2 23 35.4-97.9-6.5-18.2z',
      },
    ],
  },
  chatAi: {
    viewBox: '0 0 24 24',
    children: [
      {
        tag: 'path',
        d: 'M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM20 11C20.6986 11 21.3694 10.8806 21.9929 10.6611C21.9976 10.7735 22 10.8865 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3H14C14.1135 3 14.2265 3.00237 14.3389 3.00705C14.1194 3.63061 14 4.30136 14 5C14 8.31371 16.6863 11 20 11Z',
      },
    ],
  },
} satisfies Record<string, IconGlyph>;

type GlyphName = keyof typeof GLYPHS;

function GlyphIcon({
  glyph,
  size = 24,
  color = '#000',
}: {
  glyph: GlyphName;
  size?: number;
  color?: string;
}) {
  const def = GLYPHS[glyph];
  return (
    <Svg width={size} height={size} viewBox={def.viewBox}>
      {def.children.map((child, i) => {
        if (child.tag === 'circle') {
          return (
            <Circle key={i} cx={child.cx} cy={child.cy} r={child.r} fill={color} />
          );
        }
        if (child.fill === 'none') return null;
        return <Path key={i} d={child.d} fill={color} />;
      })}
    </Svg>
  );
}

// ── Action Definitions ──────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  glyph: GlyphName;
  color: string;
  onPress: () => void;
  /** Optional context badge — a tiny dot below the button */
  badge?: boolean;
}

interface QuickActionsBarProps {
  onBreathe?: () => void;
  onMeditate?: () => void;
  onSleep?: () => void;
  onOpenChat?: () => void;
  onOpenJournal?: () => void;
}

// ── Individual Button ───────────────────────────────────────────────────────

function QuickActionButton({
  action,
  labelColor,
  surfaceColor,
  borderColor,
}: {
  action: QuickAction;
  labelColor: string;
  surfaceColor: string;
  borderColor: string;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={styles.actionWrapper}
    >
      {/* Circle container */}
      <Animated.View
        style={[
          styles.circleOuter,
          {
            shadowColor: '#000',
          },
        ]}
      >
        <Pressable
          onPress={action.onPress}
          style={[
            styles.circle,
            {
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <GlyphIcon glyph={action.glyph} size={24} color={action.color} />
        </Pressable>
      </Animated.View>

      {/* Context badge dot */}
      {action.badge && (
        <View style={[styles.badgeDot, { backgroundColor: action.color }]} />
      )}

      {/* Label */}
      <Text style={[styles.label, { color: labelColor }]}>
        {action.label}
      </Text>
    </Animated.View>
  );
}

// ── Bar ─────────────────────────────────────────────────────────────────────

export function QuickActionsBar({
  onBreathe,
  onMeditate,
  onSleep,
  onOpenChat,
  onOpenJournal,
}: QuickActionsBarProps) {
  const { colors } = useTheme();

  const actions: QuickAction[] = [
    {
      id: 'breathing',
      label: 'Breathe',
      glyph: 'leaf',
      color: colors.brand.secondary,   // Brand secondary
      onPress: onBreathe ?? (() => {}),
    },
    {
      id: 'journal',
      label: 'Journal',
      glyph: 'journal',
      color: colors.brand.primary,   // Brand violet
      onPress: onOpenJournal ?? (() => {}),
    },
    {
      id: 'meditation',
      label: 'Meditate',
      glyph: 'meditate',
      color: '#F59E0B',     // Amber
      onPress: onMeditate ?? (() => {}),
    },
    {
      id: 'sleep',
      label: 'Sleep',
      glyph: 'sleep',
      color: '#6366F1',     // Indigo
      onPress: onSleep ?? (() => {}),
    },
    {
      id: 'chat',
      label: 'AI Chat',
      glyph: 'chatAi',
      color: '#10B981',     // Emerald
      onPress: onOpenChat ?? (() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <QuickActionButton
          key={action.id}
          action={action}
          labelColor={colors.text.secondary}
          surfaceColor={colors.surface.primary}
          borderColor={colors.border.default}
        />
      ))}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 4,
  },
  actionWrapper: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  circleOuter: {
    // Soft shadow — 4-6% opacity
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: -4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

export default QuickActionsBar;
