import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
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
      ? 'rgba(255, 255, 255, 0.14)'
      : 'rgba(15, 23, 42, 0.08)';

  const shadowColor = theme === 'dark' ? '#000000' : '#334155';
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
        intensity={theme === 'dark' ? 70 : 90}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Clean, theme-fitted surface. This sits over the BlurView so the bar
          looks intentional and consistent in BOTH themes and on web (where
          BlurView has no effect). No white/silver gradient sheen. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              theme === 'dark'
                ? 'rgba(18, 18, 27, 0.88)'
                : 'rgba(255, 255, 255, 0.88)',
          },
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.glassHighlight,
          {
            backgroundColor:
              theme === 'dark'
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(255, 255, 255, 0.7)',
          },
        ]}
        pointerEvents="none"
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
