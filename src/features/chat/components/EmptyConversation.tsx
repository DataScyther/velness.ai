import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { RefreshCw, ChevronRight } from 'lucide-react-native';
import { BreathingSticker, type StickerKind } from './BreathingSticker';
import { EmotionAvatar } from '@/components/emotion';
import type { EmotionType } from '@/constants/emotions';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/core/store/useAppStore';
import { useSessionContext } from '@/features/chat/hooks/useSessionContext';
import { spacing, borderRadius } from '@/core/theme/tokens';
import Svg, { Path } from 'react-native-svg';

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const firstName = name.split(' ')[0] || 'NK';
  if (hour >= 5 && hour < 12) return `Good morning, ${firstName}.`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${firstName}.`;
  return `Good evening, ${firstName}.`;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// ── Topic chip glyphs (react-icons path data, rendered via react-native-svg) ──
// Work → MdWork (md), Relationships → PiHeartBreakFill (pi),
// Studies → TbSchoolFilled (tb), Sleep → GiNightSleep (gi).
type ChipGlyphChild =
  | { tag: 'path'; d: string; fill?: 'none' };

interface ChipGlyph {
  viewBox: string;
  children: ChipGlyphChild[];
}

const CHIP_GLYPHS = {
  work: {
    viewBox: '0 0 24 24',
    children: [
      { tag: 'path', d: 'M0 0h24v24H0z', fill: 'none' },
      { tag: 'path', d: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-6 0h-4V4h4z' },
    ],
  },
  relationship: {
    viewBox: '0 0 256 256',
    children: [
      { tag: 'path', d: 'M239.81,107.5c-5.19,67.42-103.7,121.23-108,123.54a8,8,0,0,1-7.58,0C119.8,228.67,16,172,16,102a62,62,0,0,1,96.47-51.55,4,4,0,0,1,.61,6.17L99.72,70a8,8,0,0,0,0,11.31l32.53,32.53L111,135a8,8,0,1,0,11.31,11.31l26.88-26.87a8,8,0,0,0,0-11.31L116.7,75.63l17.47-17.47h0A61.63,61.63,0,0,1,178.41,40C214.73,40.23,242.59,71.29,239.81,107.5Z' },
    ],
  },
  studies: {
    viewBox: '0 0 24 24',
    children: [
      { tag: 'path', d: 'M19 13.431v2.569c0 2.398 -3.205 4 -7 4s-7 -1.602 -7 -4v-2.569l5.886 2.354a3 3 0 0 0 2.011 .078l.217 -.078zm2 -2.955l-8.629 3.452a1 1 0 0 1 -.742 0l-10 -4c-.839 -.335 -.839 -1.521 0 -1.856l10 -4a1 1 0 0 1 .245 -.064l.126 -.008l.126 .008a1 1 0 0 1 .245 .064l10.032 4.013l.108 .055l.099 .068l.088 .076l.075 .082l.035 .044l.073 .115l.052 .115l.034 .102l.025 .135l.006 .058l.002 6.065a1 1 0 0 1 -2 0z' },
    ],
  },
  sleep: {
    viewBox: '0 0 512 512',
    children: [
      { tag: 'path', d: 'M294.8 26.57L238 60.37l7.8 13.17L281 52.59 270.8 118l6.3 10.6L336 93.53l-7.8-13.17-37.3 22.14L301 37.12l-6.2-10.55zM147.1 60.55A224 224 0 0 0 32 256a224 224 0 0 0 224 224 224 224 0 0 0 214.9-161.2A208 208 0 0 1 320 384a208 208 0 0 1-208-208 208 208 0 0 1 35.1-115.45zm244.5 52.05l-6.9 16.5 44.1 18.4-68.3 35.9-5.5 13.2 73.7 30.8 6.9-16.5-46.7-19.5 68.3-35.9 5.5-13.2-71.1-29.7zm-115 64l-97.8 35 8.1 22.7 60.6-21.7-35.4 97.9 6.5 18.1L320 292.4l-8.1-22.7-64.2 23 35.4-97.9-6.5-18.2z' },
    ],
  },
} satisfies Record<string, ChipGlyph>;

// ── Breathing Space card stickers ──
// Each template maps to a high-quality, colorful, sticker-style illustration
// (rendered by BreathingSticker) so the card visually communicates what the
// exercise is about — no skeleton/loading icon.
const STICKER_KINDS: Record<string, StickerKind> = {
  'Breathing Space': 'breath',
  'Box Breathing': 'box',
  '4-7-8 Breath': '478',
  'Grounding Check-in': 'ground',
  'Body Scan': 'body',
  'Worry Dump': 'worry',
  'Gratitude Pause': 'gratitude',
  'Thought Reframe': 'reframe',
  'Evening Wind-Down': 'winddown',
  'Stress Reset': 'reset',
  'Self-Compassion': 'compassion',
  'Focus Primer': 'focus',
  'Anxiety Relief': 'anxiety',
  'Morning Intention': 'intention',
  'Let It Go': 'letgo',
  'Heartbeat Calm': 'heartbeat',
  Visualization: 'visualize',
  'Name the Feeling': 'name',
  'Digital Detox': 'detox',
  'Confidence Boost': 'confidence',
};

type ChipGlyphName = keyof typeof CHIP_GLYPHS;

// ── Breathing Space rotating templates ──
// A large pool of wellness/breathing exercises. A fresh one is picked every
// time the chat screen mounts (new user, refresh, or re-entering the tab),
// so the Breathing Space card keeps surfacing new examples/templates.
interface BreathingTemplate {
  title: string;
  subtitle: string;
  // Prompt sent to the assistant when the user taps "Start".
  prompt: string;
  // Accent color for the sticker + card tint.
  color: string;
}

const BREATHING_TEMPLATES: BreathingTemplate[] = [
  { title: 'Breathing Space', subtitle: 'A quick 2-minute exercise to calm your racing thoughts', prompt: 'Guide me through a 2-minute breathing space exercise to calm my racing thoughts.', color: '#38BDF8' },
  { title: 'Box Breathing', subtitle: 'Inhale, hold, exhale, hold — steady your nervous system', prompt: 'Walk me through a box breathing exercise (4-4-4-4) to feel grounded.', color: '#A78BFA' },
  { title: '4-7-8 Breath', subtitle: 'A calming rhythm to help you unwind and sleep', prompt: 'Lead me through a 4-7-8 breathing exercise to help me relax.', color: '#60A5FA' },
  { title: 'Grounding Check-in', subtitle: 'Notice 5 things you can see, 4 you can feel…', prompt: 'Take me through a 5-4-3-2-1 grounding exercise for anxiety.', color: '#34D399' },
  { title: 'Body Scan', subtitle: 'Release tension you did not know you were holding', prompt: 'Guide me through a short body scan to release tension.', color: '#F472B6' },
  { title: 'Worry Dump', subtitle: 'Offload what is on your mind, one line at a time', prompt: 'Help me brain-dump my worries and sort out what I can actually control.', color: '#94A3B8' },
  { title: 'Gratitude Pause', subtitle: 'Name three small good things from today', prompt: 'Help me reflect on three things I am grateful for today.', color: '#FB7185' },
  { title: 'Thought Reframe', subtitle: 'Look at a heavy thought from a kinder angle', prompt: 'Help me reframe a negative thought I keep having.', color: '#FBBF24' },
  { title: 'Evening Wind-Down', subtitle: 'Signal your body it is safe to rest', prompt: 'Guide me through an evening wind-down routine to sleep better.', color: '#818CF8' },
  { title: 'Stress Reset', subtitle: 'A 60-second reset when everything feels loud', prompt: 'Give me a 60-second reset I can do right now when overwhelmed.', color: '#F59E0B' },
  { title: 'Self-Compassion', subtitle: 'Speak to yourself like a good friend would', prompt: 'Help me practice self-compassion about something I am struggling with.', color: '#F472B6' },
  { title: 'Focus Primer', subtitle: 'Clear the mental clutter before you begin', prompt: 'Help me clear my head and get focused before I start working.', color: '#2DD4BF' },
  { title: 'Anxiety Relief', subtitle: 'Slow the spiral with a simple breathing pattern', prompt: 'Help me calm an anxiety spiral with a simple technique.', color: '#38BDF8' },
  { title: 'Morning Intention', subtitle: 'Set one gentle intention for the day', prompt: 'Help me set a calm, realistic intention for my day.', color: '#FCD34D' },
  { title: 'Let It Go', subtitle: 'Loosen your grip on a frustrating moment', prompt: 'Help me let go of something frustrating that happened today.', color: '#A3E635' },
  { title: 'Heartbeat Calm', subtitle: 'Slow a pounding heart after a shock', prompt: 'Help me calm my racing heart after a stressful moment.', color: '#F87171' },
  { title: 'Visualization', subtitle: 'Picture a place where you feel safe', prompt: 'Guide me through a calming safe-place visualization.', color: '#C084FC' },
  { title: 'Name the Feeling', subtitle: 'Put words to what is really going on', prompt: 'Help me name and understand what I am actually feeling right now.', color: '#38BDF8' },
  { title: 'Digital Detox', subtitle: 'A minute away from the noise of screens', prompt: 'Help me take a mindful break from my phone and screens.', color: '#22D3EE' },
  { title: 'Confidence Boost', subtitle: 'Reconnect with something you do well', prompt: 'Help me rebuild a little confidence before a hard conversation.', color: '#FB923C' },
];

// Pick a random index that differs from the previous one (when possible),
// so consecutive refreshes always show a new template.
function pickTemplateIndex(prev: number): number {
  if (BREATHING_TEMPLATES.length <= 1) return 0;
  let next = prev;
  while (next === prev) {
    next = Math.floor(Math.random() * BREATHING_TEMPLATES.length);
  }
  return next;
}

function ChipGlyphIcon({
  glyph,
  size = 16,
  color = '#000',
  style,
}: {
  glyph: ChipGlyphName;
  size?: number;
  color?: string;
  style?: object;
}) {
  const def = CHIP_GLYPHS[glyph];
  return (
    <Svg width={size} height={size} viewBox={def.viewBox} style={style}>
      {def.children.map((child, i) => (
        <Path key={i} d={child.d} fill={child.fill ?? color} />
      ))}
    </Svg>
  );
}

interface EmptyConversationProps {
  onQuickStarterSelect?: (text: string) => void;
  onResumeLastConversation?: () => void;
}

export const EmptyConversation = React.memo(function EmptyConversation({
  onQuickStarterSelect,
  onResumeLastConversation,
}: EmptyConversationProps) {
  const { colors } = useTheme();
  const user = useAppStore((state) => state.session.user);
  const sessionContext = useSessionContext();
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  // Rotating Breathing Space template — reseeded on every mount (new user,
  // refresh, or re-entering the chat screen) so a fresh example appears.
  const [templateIndex, setTemplateIndex] = useState<number>(() => pickTemplateIndex(-1));
  useEffect(() => {
    setTemplateIndex((prev) => pickTemplateIndex(prev));
  }, []);

  const breathingTemplate = BREATHING_TEMPLATES[templateIndex];


  const userName = user?.name || 'NK';
  const currentMood = sessionContext?.mood || sessionContext?.previousSessionMood || 'Overwhelmed';
  const hasPreviousSession = !!sessionContext?.previousSessionAt;
  const dateLabel = sessionContext?.previousSessionAt
    ? formatRelativeDate(sessionContext.previousSessionAt)
    : null;
  const focus = sessionContext?.previousSessionFocus ?? null;

  const handleStarterSelect = useCallback((text: string) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onQuickStarterSelect?.(text);
  }, [onQuickStarterSelect]);

  const handleChipSelect = useCallback((chip: { label: string; text: string }) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setSelectedChip(chip.label);
    onQuickStarterSelect?.(chip.text);
  }, [onQuickStarterSelect]);

  const handleResumePress = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    onResumeLastConversation?.();
  }, [onResumeLastConversation]);

  // Topic chips for "What's been on your mind today?"
  const topicChips = useMemo<{ label: string; icon: ChipGlyphName; text: string }[]>(() => [
    { label: 'Work', icon: 'work', text: 'I want to reflect on my work day' },
    { label: 'Relationships', icon: 'relationship', text: 'I need to talk about relationships' },
    { label: 'Studies', icon: 'studies', text: "I'm feeling stress about my studies" },
    { label: 'Sleep', icon: 'sleep', text: "I'm having trouble winding down for sleep" },
  ], []);

  // Mood lookup map
  const moodMap = useMemo(() => ({
    great: { emotion: 'great' as EmotionType, label: 'Great', color: '#10B981' },
    calm: { emotion: 'calm' as EmotionType, label: 'Calm', color: '#3B82F6' },
    sad: { emotion: 'notGood' as EmotionType, label: 'Sad', color: '#8B5CF6' },
    frustrated: { emotion: 'overwhelmed' as EmotionType, label: 'Frustrated', color: '#EF4444' },
    anxious: { emotion: 'overwhelmed' as EmotionType, label: 'Anxious', color: '#F59E0B' },
    overwhelmed: { emotion: 'overwhelmed' as EmotionType, label: 'Overwhelmed', color: '#6D28D9' },
  }), []);

  const currentMoodKey = currentMood?.toLowerCase() || 'overwhelmed';
  const moodInfo = moodMap[currentMoodKey as keyof typeof moodMap] || { emotion: 'good' as EmotionType, label: currentMood, color: colors.brand.primary };

  return (
    <View style={styles.container}>
      {/* Flexible spacer — rebalances vertical distribution so the hero sits
          lower / more balanced rather than crammed at the top with a head gap */}
      <View style={styles.heroSpacer} />
      {/* Unified hero greeting + last check-in card */}
      <Animated.View
        entering={FadeInUp.duration(450)}
        style={[styles.heroCard, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}
      >
        {/* Greeting section */}
        <View style={styles.heroCardHead}>
          <Text style={[styles.heroCardGreeting, { color: colors.text.primary }]}>
            {getGreeting(userName)}
          </Text>
          <Text style={[styles.heroCardTagline, { color: colors.text.secondary }]}>
            You don't have to carry today alone.
          </Text>
        </View>

        <View style={[styles.heroCardDivider, { backgroundColor: colors.border.subtle }]} />

        {/* Last check-in section */}
        <View style={styles.heroCardCheckIn}>
          <View style={styles.heroCardCheckInHeader}>
            <View style={styles.heroCardCheckInHeaderLeft}>
              <View style={[styles.heroCardCheckInDot, { backgroundColor: colors.brand.primary }]} />
              <Text style={[styles.heroCardCheckInLabel, { color: colors.text.tertiary }]}>Your last check-in</Text>
            </View>
            {dateLabel && (
              <Text style={[styles.heroCardCheckInDate, { color: colors.text.tertiary }]}>{dateLabel}</Text>
            )}
          </View>

          <View style={styles.heroCardCheckInBody}>
            <View style={[styles.heroCardMoodAvatar, { backgroundColor: moodInfo.color + '1A' }]}>
              <EmotionAvatar emotion={moodInfo.emotion} size={30} animated={false} showGlow={false} />
            </View>
            <View style={styles.heroCardMoodText}>
              <Text style={[styles.heroCardCheckInCaption, { color: colors.text.tertiary }]}>Feeling</Text>
              <Text style={[styles.heroCardMoodValue, { color: moodInfo.color }]}>{moodInfo.label}</Text>
            </View>
          </View>

          {focus && (
            <View style={[styles.heroCardFocus, { borderTopColor: colors.border.subtle }]}>
              <Text style={[styles.heroCardFocusLabel, { color: colors.text.tertiary }]}>Focus</Text>
              <Text style={[styles.heroCardFocusValue, { color: colors.text.secondary }]} numberOfLines={1}>
                {focus}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* 3. What's been on your mind today? Chips Section */}
      <Animated.View entering={FadeInUp.duration(450).delay(250)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>What's been on your mind today?</Text>
        <View style={styles.chipRow}>
          {topicChips.map((chip) => {
            const isSelected = selectedChip === chip.label;
            return (
              <Pressable
                key={chip.label}
                onPress={() => handleChipSelect(chip)}
                style={styles.chipPressable}
                accessibilityRole="button"
                accessibilityLabel={chip.label}
                accessibilityState={{ selected: isSelected }}
              >
                {({ pressed }) => (
                  <View style={[
                    styles.chipButton,
                    {
                      backgroundColor: isSelected
                        ? colors.brand.primary
                        : pressed
                          ? colors.brand.primary + '18'
                          : colors.surface.primary,
                      borderColor: isSelected ? colors.brand.primary : colors.border.default,
                    }
                  ]}>
                    <ChipGlyphIcon glyph={chip.icon} size={16} color={isSelected ? colors.brand.contrastText : colors.brand.primary} style={styles.chipIcon} />
                    <Text style={[styles.chipLabel, { color: isSelected ? colors.brand.contrastText : colors.text.primary }]}>{chip.label}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* 4. Shortcuts: Breathing & Resume last session (Upgraded to prominent full-width card widgets) */}
      <Animated.View entering={FadeInUp.duration(450).delay(450)} style={styles.shortcutContainer}>
        {/* Breathing Space card — rotates through templates on each mount/refresh */}
        <Pressable
          onPress={() => {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            onQuickStarterSelect?.(breathingTemplate.prompt);
          }}
          style={styles.pressableContainer}
          accessibilityRole="button"
          accessibilityLabel={breathingTemplate.title}
        >
          {({ pressed }) => (
            <View style={[
              styles.breathingSpaceCard,
              {
                backgroundColor: pressed ? colors.background.secondary : colors.surface.primary,
                borderColor: colors.border.default,
              }
            ]}>
              <View style={styles.breathingLeft}>
                <BreathingSticker
                  kind={STICKER_KINDS[breathingTemplate.title] ?? 'breath'}
                  color={breathingTemplate.color}
                  size={30}
                />
                <View style={styles.breathingMeta}>
                  <Text style={[styles.breathingTitle, { color: colors.text.primary }]}>{breathingTemplate.title}</Text>
                  <Text style={[styles.breathingSubtitle, { color: colors.text.secondary }]}>{breathingTemplate.subtitle}</Text>
                </View>
              </View>
              <View style={styles.breathingActions}>
                <Pressable
                  onPress={() => {
                    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
                    setTemplateIndex((prev) => pickTemplateIndex(prev));
                  }}
                  hitSlop={8}
                  style={[styles.refreshPill, { borderColor: colors.border.default }]}
                  accessibilityRole="button"
                  accessibilityLabel="Show another exercise"
                >
                  <RefreshCw size={14} color={colors.text.secondary} />
                </Pressable>
                <View style={[styles.startPill, { backgroundColor: colors.brand.primary }]}>
                  <Text style={[styles.startText, { color: colors.brand.contrastText }]}>Start</Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>

        {hasPreviousSession && onResumeLastConversation && (
          <Pressable
            onPress={handleResumePress}
            style={[styles.pressableContainer, { marginTop: spacing.md }]}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View style={[
                styles.resumeCard,
                {
                  backgroundColor: pressed ? colors.background.secondary : colors.surface.primary,
                  borderColor: colors.border.default,
                }
              ]}>
                <View style={styles.resumeLeft}>
                  <View style={[styles.resumeIconCircle, { backgroundColor: colors.background.secondary }]}>
                    <RefreshCw size={16} color={colors.brand.primary} />
                  </View>
                  <View style={styles.resumeMeta}>
                    <Text style={[styles.resumeTitle, { color: colors.text.primary }]}>Resume Last Conversation</Text>
                    <Text style={[styles.resumeSubtitle, { color: colors.text.secondary }]}>Pick up where you left off with Velness</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.text.secondary} />
              </View>
            )}
          </Pressable>
        )}
      </Animated.View>

      {/* Bottom spacer — smaller than the top spacer so the card block
          sits higher (less Y-axis offset toward the bottom) */}
      <View style={styles.heroSpacerBottom} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing['6xl'],
  },
  heroSpacer: {
    flex: 0.5,
  },
  heroSpacerBottom: {
    flex: 1.5,
  },
  heroCard: {
    alignSelf: 'stretch',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  heroCardHead: {
    marginBottom: spacing.lg,
  },
  heroCardGreeting: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginBottom: spacing.xs,
  },
  heroCardTagline: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  heroCardDivider: {
    height: 1,
    width: '100%',
    marginBottom: spacing.lg,
  },
  heroCardCheckIn: {
    width: '100%',
  },
  heroCardCheckInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heroCardCheckInHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCardCheckInDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  heroCardCheckInLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroCardCheckInDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  heroCardCheckInBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCardMoodAvatar: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  heroCardMoodText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heroCardCheckInCaption: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  heroCardMoodValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  heroCardFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  heroCardFocusLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginRight: spacing.sm,
  },
  heroCardFocusValue: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
    opacity: 0.85,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pressableContainer: {
    width: '100%',
  },
  chipPressable: {
    alignSelf: 'flex-start',
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
    alignSelf: 'flex-start',
  },
  chipIcon: {
    marginRight: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  shortcutContainer: {
    width: '100%',
  },
  breathingSpaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md + 2,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  breathingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  breathingMeta: {
    flex: 1,
  },
  breathingTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  breathingSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
  breathingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  refreshPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  startPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md + 2,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  resumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  resumeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  resumeMeta: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  resumeSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
});

export default EmptyConversation;
