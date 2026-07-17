import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { typography, spacing, borderRadius } from '@/core/theme';
import { useTheme } from '@/hooks/useTheme';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { MoodSelector } from './MoodSelector';
import { ReflectionInput } from './ReflectionInput';
import { EmotionAvatar } from '@/components/emotion/EmotionAvatar';
import { MOOD_MAP, getMoodEmotion } from '@/shared/types';
import type { MoodRating } from '@/shared/types';

interface CheckInPanelProps {
  visible: boolean;
  selectedMood: MoodRating | null;
  onSelectMood: (value: MoodRating) => void;
  reflectionNote: string;
  onReflectionChange: (text: string) => void;
  reflectionInputRef: React.MutableRefObject<{ focus: () => void } | null>;
  isSaving: boolean;
  onSubmit: () => void;
  onDismiss: () => void;
}

const SPRING_CONFIG = {
  damping: 28,
  stiffness: 220,
  mass: 0.9,
  overshootClamping: true,
} as const;

export function CheckInPanel({
  visible,
  selectedMood,
  onSelectMood,
  reflectionNote,
  onReflectionChange,
  reflectionInputRef,
  isSaving,
  onSubmit,
  onDismiss,
}: CheckInPanelProps) {
  const { colors, isDark } = useTheme();
  const reduced = useReducedMotion();

  const progress = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    progress.value = reduced
      ? withTiming(visible ? 1 : 0, { duration: 220 })
      : withSpring(visible ? 1 : 0, SPRING_CONFIG);
  }, [visible, reduced, progress]);

  // Only animate opacity + translateY. Never animate `height` or layout
  // properties — on the Fabric (New Architecture) renderer that triggers the
  // "__internalInstanceHandle of null" crash and the reanimated transform
  // layout-animation warning.
  const innerStyle = useAnimatedStyle(() => {
    const translate = reduced ? 0 : interpolateSafe(progress.value, 12, 0);
    return {
      opacity: progress.value,
      transform: [{ translateY: translate }],
    };
  });

  return (
    // Outer wrapper stays PERMANENTLY mounted. Toggling `display:'none'` on
    // Fabric unmounts the host node, which nulls the fiber handle and crashes
    // the responder/inspector chain on the next tap. We hide via opacity +
    // pointerEvents on the animated inner layer instead (node never unmounts).
    // IMPORTANT: no `overflow: 'hidden'` here — it would clip the card's soft
    // drop shadow into a rectangle, producing square shadow corners over the
    // rounded card. The inner layer is hidden via opacity + pointerEvents.
    <View style={{ marginTop: 20, height: visible ? undefined : 0 }}>
      <Animated.View
        style={[styles.inner, innerStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <View
          style={[
            styles.surface,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.default,
            },
          ]}
        >
          <SectionHeader
            title="How are you feeling today?"
            subtitle="Tap what fits, then check in."
            actionText="Close"
            onActionPress={onDismiss}
          />

          <MoodSelector selectedMood={selectedMood} onSelectMood={onSelectMood} />

          {selectedMood !== null && (
            <View
              style={[
                styles.confirmBox,
                {
                  backgroundColor: colors.surface.secondary,
                  borderColor: colors.border.default,
                },
              ]}
            >
              <View style={styles.confirmRow}>
                <EmotionAvatar
                  emotion={getMoodEmotion(selectedMood)}
                  size={20}
                  animated={false}
                  showGlow={false}
                />
                <Text style={[styles.confirmText, { color: colors.text.secondary }]}>
                  {MOOD_MAP[selectedMood].label} — add a note?
                </Text>
              </View>

              <ReflectionInput
                value={reflectionNote}
                onChangeText={onReflectionChange}
                inputRef={reflectionInputRef}
              />

              <View style={styles.submitWrapper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save check-in"
                  onPress={onSubmit}
                  disabled={isSaving}
                  style={({ pressed }) => [
                    styles.submitButton,
                    {
                      // High-contrast fill so the white label is always legible.
                      // In light mode the brand purple (#634EB8) is too light for
                      // white text, so use a deeper purple; in dark mode the
                      // brand purple is already light enough. Explicit fallbacks
                      // keep the button visible even if a token is missing.
                      backgroundColor: isSaving
                        ? (colors.surface?.tertiary ?? '#EAEEF6')
                        : (isDark
                            ? (colors.brand?.primary ?? '#7E60CD')
                            : '#4C1D95'),
                      borderColor: isSaving
                        ? (colors.border?.default ?? '#E2E8F0')
                        : (colors.brand?.border ?? 'rgba(99, 78, 184, 0.45)'),
                    },
                    pressed && !isSaving && styles.submitButtonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.submitButtonText,
                      {
                        color: isSaving
                          ? (colors.text?.secondary ?? '#475569')
                          : (colors.text?.onBrand ?? '#FFFFFF'),
                      },
                    ]}
                  >
                    {isSaving ? 'Saving…' : 'Save check-in'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function interpolateSafe(value: number, from: number, to: number): number {
  'worklet';
  const v = value < 0 ? 0 : value > 1 ? 1 : value;
  return from + (to - from) * v;
}

const styles = StyleSheet.create({
  inner: {},
  surface: {
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    // Precise, refined lift: a tight, low-opacity shadow (not a wide blur) so
    // the rounded corners stay crisp and polished rather than soft/uneven.
    shadowColor: '#05030C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  confirmBox: {
    marginTop: spacing.xs,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily.sans,
  },
  // Wrapper centers the button and gives it room to breathe above the note
  // field. alignSelf keeps the capped width centered on wide screens.
  submitWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitButton: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#05030C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
});

export default CheckInPanel;
