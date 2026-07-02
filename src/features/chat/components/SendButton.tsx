import React from 'react';
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { duration: 100 }, () => {
      scale.value = withSpring(1, { duration: 100 });
    });
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.sendButton,
          {
            backgroundColor: disabled
              ? colors.border.default
              : colors.brand.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <ArrowUp
          size={18}
          color={
            disabled
              ? colors.text.secondary
              : colors.brand.contrastText
          }
          strokeWidth={2.5}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default SendButton;
