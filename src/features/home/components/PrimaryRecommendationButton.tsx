import React, { useCallback } from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Vibration,
  Platform,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Play } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface PrimaryRecommendationButtonProps {
  onPress: () => void;
  text: string;
  loading?: boolean;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PrimaryRecommendationButton = React.memo(({
  onPress,
  text,
  loading = false,
  disabled = false,
}: PrimaryRecommendationButtonProps) => {
  const scale = useSharedValue(1);
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 350 }) }],
      opacity: withSpring(disabled ? 0.6 : 1.0, { damping: 15, stiffness: 200 }),
    };
  });

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = 0.96;
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1.0;
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;

    // Trigger soft haptic feedback
    try {
      if (Platform.OS === 'ios') {
        Vibration.vibrate(10);
      } else {
        Vibration.vibrate(15);
      }
    } catch (e) {
      console.debug('Haptic feedback not available:', e);
    }

    onPress();
  }, [disabled, loading, onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[styles.button, animatedStyle]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {/* Background Gradient using Svg */}
      {!disabled && !loading && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="recBtnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.brand.primary} />
                <Stop offset="100%" stopColor={colors.brand.secondary} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={16} fill="url(#recBtnGrad)" />
          </Svg>
        </View>
      )}

      {disabled && !loading && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.secondary, borderRadius: 16 }]} pointerEvents="none" />
      )}

      {loading ? (
        <ActivityIndicator size="small" color={colors.brand.contrastText} />
      ) : (
        <View style={styles.contentRow}>
          <Play size={14} color={colors.brand.contrastText} fill={colors.brand.contrastText} style={styles.playIcon} />
          <Text style={[styles.text, { color: colors.brand.contrastText }]}>{text}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 16,
    marginVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Geomini, SF Pro Display',
    letterSpacing: 0.3,
  },
});

export default PrimaryRecommendationButton;
