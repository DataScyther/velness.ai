import React, { useMemo } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar } from '@/shared/components/Avatar';
import { useUserDisplayName, useUser } from '@/shared/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  userNameOverride?: string;
}

export function HomeHeader({
  onNotificationPress,
  userNameOverride,
}: HomeHeaderProps) {
  const displayName = useUserDisplayName();
  const user = useUser();
  const greeting = useMemo(() => getGreeting(), []);
  const { colors } = useTheme();

  const firstName = useMemo(() => {
    if (userNameOverride) return userNameOverride;
    if (!displayName || displayName === 'User') return '';
    return displayName.split(' ')[0];
  }, [displayName, userNameOverride]);

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <Image
            source={require('@/shared/assets/velness-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.wordmark, { color: colors.text.primary }]}>Velness</Text>
        </View>

        <View style={styles.brandRight}>
          <Pressable
            onPress={onNotificationPress}
            hitSlop={12}
            style={styles.iconButton}
            accessibilityLabel="View notifications"
            accessibilityRole="button"
          >
            <Bell size={20} color={colors.text.secondary} />
            <View style={[styles.notificationDot, { backgroundColor: colors.brand.primary }]} />
          </Pressable>

          <Avatar
            photoURL={user?.photoURL ?? null}
            name={displayName}
            size="sm"
          />
        </View>
      </View>

      <View style={styles.greetingSection}>
        <Text style={[styles.greetingTitle, { color: colors.text.primary }]}>
          {greeting}{firstName ? `, ${firstName}` : ''} 👋
        </Text>
        <Text style={[styles.greetingSubtitle, { color: colors.text.secondary }]}>
          Let's take care of your mind today.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  wordmark: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  brandRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greetingSection: {
    marginTop: 16,
  },
  greetingTitle: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.6,
  },
  greetingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginTop: 4,
  },
});

export default HomeHeader;
