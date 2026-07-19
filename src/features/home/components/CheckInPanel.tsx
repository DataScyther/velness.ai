import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientButton } from '@/shared/components/GradientButton';
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated';
import { typography, spacing, borderRadius } from '@/core/theme';
import { useTheme } from '@/hooks/useTheme';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { MoodSelector } from './MoodSelector';
import { ReflectionInput } from './ReflectionInput';
import { EmotionAvatar } from '@/components/emotion/EmotionAvatar';
import { MOOD_MAP, getMoodEmotion } from '@/shared/types';
import type { MoodRating } from '@/shared/types';
import { usePanelAnimation } from '../hooks/usePanelAnimation';

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
  const { colors } = useTheme();

  // Use custom hook to manage panel animation with debouncing
  const progress = usePanelAnimation(visible, { 
    springConfig: SPRING_CONFIG,
    timingConfig: { duration: 220 }
  });

  const [collapsed, setCollapsed] = useState(!visible);

  useEffect(() => {
    if (visible) {
      setCollapsed(false);
    } else {
      const timer = setTimeout(() => setCollapsed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Only animate opacity + translateY. Never animate `height` or layout
  // properties — on the Fabric (New Architecture) renderer that triggers the
  // "__internalInstanceHandle of null" crash and the reanimated transform
  // layout-animation warning.
  const innerStyle = useAnimatedStyle(() => {
    'worklet';
    const translate = interpolateSafe(progress.value, 12, 0);
    return {
      opacity: progress.value,
      transform: [{ translateY: translate }],
      // Scale shadow with opacity to prevent bleeding when hidden
      shadowOpacity: progress.value * 0.22,
      shadowRadius: progress.value * 14,
      shadowOffset: {
        width: 0,
        height: progress.value * 6,
      },
      elevation: progress.value * 5,
    };
  });

  return (
    // Outer wrapper stays PERMANENTLY mounted. Toggling `display:'none'` on
    // Fabric unmounts the host node, nulls the fiber handle, and crashes the
    // responder/inspector chain. We hide via opacity + pointerEvents on the
    // animated inner layer (node never unmounts).
    // `height` and `overflow` use a delayed `collapsed` state: on hide, they
    // snap only AFTER the exit spring animation (~400ms) completes, so the
    // ScrollView layout stays stable during the fade-out. On show, height
    // restores immediately so the content fades in at full size.
    // `overflow: 'hidden'` when collapsed clips the card's static shadow bleed.
    <View style={{ marginTop: 20, height: collapsed ? 0 : undefined, overflow: collapsed ? 'hidden' : 'visible' }}>
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
                <GradientButton
                  title="Save check-in"
                  onPress={onSubmit}
                  disabled={isSaving}
                  loading={isSaving}
                  visible={!collapsed}
                  size="lg"
                />
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
    // Shadow is now animated dynamically in innerStyle to prevent bleeding
    // when the panel is hidden. Static shadow removed to avoid artifacts.
    shadowColor: '#05030C',
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
  // field. maxWidth caps the button on wide screens.
  submitWrapper: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
});

export default CheckInPanel;
