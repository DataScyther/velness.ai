import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

interface ChatHeaderProps {
  onMorePress?: () => void;
}

export function ChatHeader({ onMorePress }: ChatHeaderProps) {
  const { colors } = useTheme();

  const handleMorePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMorePress?.();
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface.primary }]}>
      <View style={styles.leftSection}>
        <Image
          source={require('@/shared/assets/neeva-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: colors.text.primary }]}>Neeva</Text>
          <View style={styles.statusRow}>
            <View style={[styles.indicator, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          onPress={handleMorePress}
          style={styles.menuButton}
          hitSlop={12}
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <MoreVertical size={20} color={colors.text.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatHeader;
