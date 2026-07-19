import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

interface CheckInCardProps {
  onCheckIn: () => void;
}

export function CheckInCard({ onCheckIn }: CheckInCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(600).springify()}
    >
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
        <View style={styles.left}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.brand.primary}1A` }]}>
            <Calendar size={22} color={colors.brand.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Check-in</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              How are you feeling today?
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Check in now"
          style={[styles.button, { backgroundColor: colors.brand.primary, borderColor: colors.brand.border }]}
          onPress={onCheckIn}
        >
          <Text style={[styles.buttonText, { color: colors.brand.contrastText || '#FFFFFF' }]}>Check in now</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 1,
    shadowColor: '#8A5FC7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CheckInCard;
