// src/features/home/components/TodaysMissionCard.tsx
//
// A compact "medium" card showing today's focus — the current lesson title
// from the active journey. Sits beside ContinueJourneyCard in the two-column row.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Target } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface TodaysMissionCardProps {
  missionTitle: string;
  missionDescription?: string;
  onPress?: () => void;
}

export function TodaysMissionCard({
  missionTitle,
  missionDescription,
  onPress,
}: TodaysMissionCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(140).duration(500)}
      style={styles.container}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.surface.primary,
            borderColor: colors.border.default,
          },
          pressed && { opacity: 0.88 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Today's mission: ${missionTitle}`}
      >
        <View style={[styles.iconRow, { backgroundColor: `${'#F59E0B'}18` }]}>
          <Target size={18} color="#F59E0B" />
        </View>
        <Text style={[styles.eyebrow, { color: '#F59E0B' }]}>Today's Focus</Text>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={3}>
          {missionTitle}
        </Text>
        {missionDescription && (
          <Text style={[styles.desc, { color: colors.text.secondary }]} numberOfLines={2}>
            {missionDescription}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  iconRow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  desc: {
    fontSize: 12,
    lineHeight: 17,
  },
});

export default TodaysMissionCard;
