import React, { useCallback } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

export interface MoodOptionProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MoodOption = React.memo(({
  emoji,
  label,
  isSelected,
  onPress,
}: MoodOptionProps) => {
  const scale = useSharedValue(1);
  const { colors } = useTheme();
  const PRIMARY = colors.brand.primary;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(scale.value * (isSelected ? 1.05 : 1), {
            damping: 12,
            stiffness: 250,
          }),
        },
      ],
      borderColor: withSpring(
        isSelected ? PRIMARY : colors.border.default,
        { damping: 20, stiffness: 200 }
      ),
      backgroundColor: withSpring(
        isSelected ? `${PRIMARY}22` : colors.surface.secondary,
        { damping: 20, stiffness: 200 }
      ),
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = 0.95;
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1;
  }, [scale]);

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { borderColor: colors.border.default, backgroundColor: colors.surface.secondary }, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`Select mood: ${label}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color: colors.text.secondary }, isSelected && { color: colors.brand.primary, fontWeight: '600' }]}>
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 64,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MoodOption;
