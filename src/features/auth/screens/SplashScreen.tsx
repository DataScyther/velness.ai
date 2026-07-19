import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useAuth } from '@/shared/hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: (destination: 'auth' | 'home') => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const { initialized, isAuthenticated, initialize } = useAuth();
  
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const logoGlowOpacity = useSharedValue(0.4);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(15);
  
  const hasNavigated = useRef(false);

  // Initialization
  useEffect(() => {
    initialize().catch(console.error);
  }, [initialize]);

  // Entrance and Breathing animations
  useEffect(() => {
    // Entrance
    logoScale.value = withSequence(
      withTiming(1.06, { duration: 700, easing: Easing.out(Easing.back()) }),
      withTiming(1.0, { duration: 250, easing: Easing.inOut(Easing.ease) })
    );
    logoOpacity.value = withTiming(1, { duration: 500 });

    // Text fade-in
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 500 });
      textY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    }, 350);

    // Idle breathing & pulsating glow
    setTimeout(() => {
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      logoGlowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, 950);
  }, [logoScale, logoOpacity, logoGlowOpacity, textOpacity, textY]);

  // Navigate once initialized
  useEffect(() => {
    if (initialized && !hasNavigated.current) {
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        runOnJS(onComplete)(isAuthenticated ? 'home' : 'auth');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [initialized, isAuthenticated, onComplete]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const logoGlowStyle = useAnimatedStyle(() => ({
    opacity: logoGlowOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Premium Multi-Layered Radial Background */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <Defs>
            <RadialGradient
              id="splashGlow"
              cx="50%"
              cy="45%"
              rx="90%"
              ry="75%"
            >
              <Stop offset="0%" stopColor={isDark ? colors.brand.primary : colors.brand.subtle} stopOpacity={isDark ? 0.35 : 0.9} />
              <Stop offset="40%" stopColor={isDark ? colors.brand.secondary : colors.brand.subtle} stopOpacity={isDark ? 0.2 : 0.55} />
              <Stop offset="75%" stopColor={colors.background.primary} stopOpacity={isDark ? 0.95 : 1} />
              <Stop offset="100%" stopColor={colors.background.secondary} stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#splashGlow)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.contentContainer}>
          {/* Animated Circular Logo & Pulsating Glow Ring */}
          <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
            {/* Outer Pulsating Glow */}
            <Animated.View style={[styles.pulsatingGlow, logoGlowStyle, { backgroundColor: isDark ? colors.brand.primary + '29' : colors.brand.primary + '14' }]} />
            
            {/* Premium Glass Ring */}
            <View style={[styles.glowRing, {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.75)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : colors.brand.primary + '2E',
              shadowColor: colors.brand.primary,
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.15,
              shadowRadius: 28,
              elevation: 20,
            }]}>
              <Image
                source={require('@/shared/assets/velness-logo.jpg')}
                style={styles.logoImage}
              />
            </View>
          </Animated.View>

          {/* Title & Subtitle Section */}
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Velness
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Your personal AI wellness companion
            </Text>
          </Animated.View>
        </View>

        {/* Loading Spinner */}
        <View style={styles.loaderContainer}>
            {!initialized && (
              <LoadingSpinner size={26} color={isDark ? colors.brand.primary : colors.brand.secondary} />
            )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulsatingGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  glowRing: {
    width: 156,
    height: 156,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.65,
    textAlign: 'center',
    maxWidth: 240,
  },
  loaderContainer: {
    height: 40,
    justifyContent: 'center',
  },
});

export default SplashScreen;