import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ArrowUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SendButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function SendButton({ onPress, disabled = false }: SendButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const disabledProgress = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    disabledProgress.value = withSpring(disabled ? 1 : 0, { damping: 18, stiffness: 250 });
  }, [disabled]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = disabledProgress.value;
    return {
      opacity: 1 - p * 0.5,
      transform: [{ scale: scale.value * (1 - p * 0.1) }],
    };
  });

  const animatedShadow = useAnimatedStyle(() => ({
    shadowOpacity: (1 - disabledProgress.value) * 0.35,
    shadowRadius: (1 - disabledProgress.value) * 12,
  }));

  const handlePress = () => {
    if (disabled) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    scale.value = withSpring(0.88, { damping: 12, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 250 });
    });
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, animatedShadow]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.sendButton,
          {
            backgroundColor: disabled
              ? colors.surface.secondary
              : colors.brand.primary,
            borderWidth: disabled ? 1 : 0,
            borderColor: disabled ? colors.border.default : 'transparent',
            shadowColor: disabled ? 'transparent' : colors.brand.primary,
            opacity: pressed && !disabled ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <ArrowUp
          size={20}
          color={disabled ? colors.text.secondary : colors.brand.contrastText}
          strokeWidth={2.5}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default SendButton;
