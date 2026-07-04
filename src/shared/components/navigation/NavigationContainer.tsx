import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  WithSpringConfig,
} from 'react-native-reanimated';
import { useNavigationContext } from './NavigationContext';
import { LAYOUT } from '@/shared/constants';

const PILL_RADIUS = LAYOUT.TAB_BAR_HEIGHT / 2;

const entrySpring: WithSpringConfig = {
  stiffness: 200,
  damping: 20,
  mass: 1,
};

interface NavigationContainerProps {
  children: React.ReactNode;
}

export function NavigationContainer({
  children,
}: NavigationContainerProps) {
  const { theme } = useNavigationContext();
  const insets = useSafeAreaInsets();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(100, withSpring(1, entrySpring));
    scale.value = withDelay(100, withSpring(1, entrySpring));
    translateY.value = withDelay(100, withSpring(0, entrySpring));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value } as { scale: number },
      { translateY: translateY.value } as { translateY: number },
    ],
  }));

  const containerBorderColor =
    theme === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.07)';

  const shadowColor = theme === 'dark' ? '#000000' : '#475569';
  const bottomPosition = Math.max(LAYOUT.TAB_BAR_MARGIN, insets.bottom);

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          borderColor: containerBorderColor,
          shadowColor: shadowColor,
          bottom: bottomPosition,
          ...(Platform.OS === 'web' && {
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
          }),
        },
      ]}
    >
      <BlurView
        intensity={theme === 'dark' ? 75 : 90}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="glassGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.06)" stopOpacity={1} />
              <Stop offset="50%" stopColor="rgba(26, 20, 42, 0.55)" stopOpacity={1} />
              <Stop offset="100%" stopColor="rgba(11, 8, 20, 0.92)" stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="glassGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" stopOpacity={1} />
              <Stop offset="40%" stopColor="rgba(240, 244, 248, 0.50)" stopOpacity={1} />
              <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.92)" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            rx={PILL_RADIUS}
            fill={theme === 'dark' ? 'url(#glassGradientDark)' : 'url(#glassGradientLight)'}
          />
        </Svg>
      </View>

      <View
        style={[
          styles.glassHighlight,
          {
            backgroundColor:
              theme === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.70)',
          },
        ]}
      />

      <View style={styles.contentRow}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: LAYOUT.TAB_BAR_MARGIN,
    right: LAYOUT.TAB_BAR_MARGIN,
    height: LAYOUT.TAB_BAR_HEIGHT,
    borderRadius: PILL_RADIUS,
    borderWidth: 0.5,
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    zIndex: 100,
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    borderRadius: 1,
    zIndex: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    zIndex: 3,
  },
});

export default NavigationContainer;
