/**
 * PracticeCategoryCard — Square card for a practice category
 *
 * Displays:
 *  - Centered icon with tinted circular background
 *  - Category title
 *  - Short description
 *  - Session/lesson count badge
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

interface PracticeCategoryCardProps {
  /** Lucide icon component. */
  icon: React.ReactNode;
  /** Category title. */
  title: string;
  /** Short description. */
  description: string;
  /** Label for count badge (e.g. "8 Lessons"). */
  countLabel: string;
  /** Accent color for the icon background. */
  accentColor: string;
  /** Card width. */
  width?: number;
  /** Stagger delay for entrance animation. */
  animationDelay?: number;
  /** Callback when tapped. */
  onPress?: () => void;
}

export const PracticeCategoryCard = React.memo(({
  icon,
  title,
  description,
  countLabel,
  accentColor,
  width = 140,
  animationDelay = 0,
  onPress,
}: PracticeCategoryCardProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).duration(500).springify()}
      style={{ width }}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.surface.primary : '#FFFFFF',
            borderColor: isDark ? colors.border.default : '#E5E7EB',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${description}. ${countLabel}`}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${accentColor}${isDark ? '18' : '12'}` },
          ]}
        >
          {icon}
        </View>

        {/* Title */}
        <Text
          style={[styles.title, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Description */}
        <Text
          style={[styles.description, { color: colors.text.secondary }]}
          numberOfLines={2}
        >
          {description}
        </Text>

        {/* Count badge */}
        <View style={[styles.countBadge, { backgroundColor: `${accentColor}${isDark ? '15' : '0D'}` }]}>
          <Text style={[styles.countText, { color: accentColor }]}>
            {countLabel}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

PracticeCategoryCard.displayName = 'PracticeCategoryCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minHeight: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: spacing.sm,
    minHeight: 30,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default PracticeCategoryCard;
