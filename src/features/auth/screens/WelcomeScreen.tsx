import React, { useCallback, useEffect } from 'react';
import { View, Text, Dimensions, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { User, Shield, Info } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/core/store/useAppStore';
import { authService } from '@/services/auth';
import { analyticsService } from '@/services/analytics';
import { spacing, typography } from '@/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScaleButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style: any;
}

function ScaleButton({ onPress, children, style }: ScaleButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      accessibilityRole="button"
    >
      {children}
    </AnimatedPressable>
  );
}

export function WelcomeScreen() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const setEmailVerified = useAppStore((state) => state.setEmailVerified);
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted);
  
  const { colors: themeColors } = useTheme();

  const handleSignIn = useCallback(() => {
    analyticsService.trackEvent('login_attempt', { action: 'welcome_login' });
    router.push('/auth/login');
  }, [router]);

  const handleSignUp = useCallback(() => {
    analyticsService.trackEvent('login_attempt', { action: 'welcome_signup' });
    router.push('/auth/signup');
  }, [router]);

  const handleGuestMode = useCallback(async () => {
    analyticsService.trackEvent('login_attempt', { action: 'welcome_guest' });

    try {
      const guestProfile = await authService.signInAsGuest();
      setUser(guestProfile);
      setEmailVerified(true);
      setOnboardingCompleted(true);
      router.replace('/(tabs)');
    } catch (err) {
      console.warn('[WelcomeScreen] Guest mode failed:', err);
    }
  }, [setUser, setEmailVerified, setOnboardingCompleted, router]);

  return (
    <View style={styles.outerContainer}>
      {/* Top Half: Premium serenade illustration with smooth Perplexity-style gradient transition */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/shared/assets/welcome_illustration.png')}
          style={styles.illustration}
        />
        {/* Vertical blending gradient overlay */}
        <LinearGradient
          colors={['rgba(10, 5, 22, 0)', 'rgba(10, 5, 22, 0.3)', 'rgba(10, 5, 22, 0.75)', 'rgba(10, 5, 22, 1)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Skip button in the top right */}
        <SafeAreaView style={styles.skipContainer} edges={['top']}>
          <Pressable 
            style={styles.skipButton} 
            onPress={handleGuestMode}
            accessibilityRole="button"
            accessibilityLabel="Skip auth"
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Bottom Half: Centered brand logo & action buttons */}
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.contentContainer}>
          {/* Brand Section */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(600).springify()} 
            style={styles.brandSection}
          >
            <View style={styles.logoRing}>
              <Image
                source={require('@/shared/assets/velness-logo.jpg')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.brandText}>Velness</Text>
            <Text style={styles.taglineText}>Your personal AI wellness companion</Text>
          </Animated.View>

          {/* Action Buttons Section */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(600).springify()} 
            style={styles.buttonSection}
          >
            {/* Primary Email Sign In */}
            <ScaleButton style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </ScaleButton>

            {/* Secondary Create Account */}
            <ScaleButton style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </ScaleButton>

            {/* Guest Action Option */}
            <ScaleButton style={styles.guestButton} onPress={handleGuestMode}>
              <User color="#FFFFFF" size={16} strokeWidth={2.2} />
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </ScaleButton>
          </Animated.View>

          {/* Footer Legal links */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(600).springify()} 
            style={styles.footerSection}
          >
            <Pressable style={styles.footerLink}>
              <Text style={styles.footerText}>Privacy policy</Text>
            </Pressable>
            <View style={styles.footerDivider} />
            <Pressable style={styles.footerLink}>
              <Text style={styles.footerText}>Terms of service</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0A0516', // Core brand dark background
  },
  imageContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.46,
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  skipContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: -20, // Shifts brand logo slightly into the gradient zone for better flow
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  brandText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.0,
    marginTop: 14,
  },
  taglineText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  buttonSection: {
    gap: 12,
    width: '100%',
    marginVertical: 20,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0516',
    letterSpacing: -0.3,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  guestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.35)',
    fontWeight: '500',
  },
  footerDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 4,
  },
});

export default WelcomeScreen;