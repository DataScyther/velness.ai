import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

const SELECTED_SCALE = 1.06;

export const MoodOption = React.memo(({
  emotion,
  label,
  isSelected,
  onPress,
}: MoodOptionProps) => {
  const { colors } = useTheme();
  const PRIMARY = colors.brand.primary;
  const SELECTED_BG = `${PRIMARY}22`;

  const handlePress = useCallback(() => {
    void triggerEmotionHaptic();
    onPress();
  }, [onPress]);

  return (
    <Animated.View entering={FadeInDown.duration(250)} style={{ flex: 1 }}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.card,
          {
            borderColor: isSelected ? PRIMARY : colors.border.subtle,
            backgroundColor: isSelected ? SELECTED_BG : colors.surface.secondary,
            transform: [{ scale: isSelected ? SELECTED_SCALE : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Select mood: ${label}`}
        accessibilityState={{ selected: isSelected }}
      >
        <EmotionAvatar
          emotion={emotion}
          size={32}
          animated={false}
          selected={isSelected}
          showGlow={false}
        />
        <Text style={[styles.label, { color: isSelected ? colors.brand.primary : colors.text.secondary }, isSelected && { fontWeight: '700' }]}>
          {label}
        </Text>
      </Pressable>
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
