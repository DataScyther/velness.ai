import React, { useCallback, useEffect } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { EmotionAvatar } from '@/components/emotion/EmotionAvatar';
import { triggerEmotionHaptic } from '@/constants/emotions';
import type { EmotionType } from '@/constants/emotions';

export interface MoodOptionProps {
  emotion: EmotionType;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MoodOption = React.memo(({
  emotion,
  label,
  isSelected,
  onPress,
}: MoodOptionProps) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);
  const { colors } = useTheme();
  const PRIMARY = colors.brand.primary;
  const SELECTED_BG = `${PRIMARY}22`;
  const reduced = useReducedMotion();

  // Subtle, sophisticated resting scale when selected — a gentle lift, not a jump.
  const SELECTED_SCALE = 1.06;

  useEffect(() => {
    const target = isSelected ? SELECTED_SCALE : 1;
    // Critically-damped springs: ease to rest with no overshoot/wobble.
    if (reduced) {
      scale.value = target;
      progress.value = isSelected ? 1 : 0;
    } else {
      // No hard kick — animate smoothly from the current scale.
      scale.value = withSpring(target, { damping: 18, stiffness: 220 });
      progress.value = withSpring(isSelected ? 1 : 0, { damping: 22, stiffness: 220 });
    }
  }, [isSelected, reduced, scale, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
      // NOTE: withSpring must animate numbers, not color strings. Use a numeric
      // progress value and interpolateColor so the background/border animate validly.
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.border.default, PRIMARY]
      ),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.surface.secondary, SELECTED_BG]
      ),
    };
  });

  const handlePressIn = useCallback(() => {
    // Gentle, controlled press — minimal travel, no bounce-back.
    scale.value = reduced
      ? scale.value
      : withSpring(0.96, { damping: 16, stiffness: 220 });
  }, [scale, reduced]);

  const handlePressOut = useCallback(() => {
    const target = isSelected ? SELECTED_SCALE : 1;
    scale.value = reduced ? target : withSpring(target, { damping: 16, stiffness: 220 });
  }, [scale, reduced, isSelected]);

  const handlePress = useCallback(() => {
    void triggerEmotionHaptic();
    onPress();
  }, [onPress]);

  return (
    <Animated.View entering={FadeInDown.duration(250)} style={{ flex: 1 }}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { borderColor: colors.border.subtle, backgroundColor: colors.surface.secondary }, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`Select mood: ${label}`}
        accessibilityState={{ selected: isSelected }}
      >
        <EmotionAvatar
          emotion={emotion}
          size={32}
          animated
          selected={isSelected}
          showGlow={false}
        />
        <Text style={[styles.label, { color: colors.text.secondary }, isSelected && { color: colors.brand.primary, fontWeight: '700' }]}>
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 76,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default MoodOption;
