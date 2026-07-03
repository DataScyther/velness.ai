/**
 * RecommendationCard — Daily recommended activity
 *
 * Horizontal card with:
 *  - Square thumbnail on the left (gradient background)
 *  - Category tag (e.g. "MORNING RESET")
 *  - Activity title + description
 *  - Duration chip with clock icon
 *  - "Start" CTA button
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle as SvgCircle } from 'react-native-svg';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

interface RecommendationCardProps {
  /** Activity title. */
  title: string;
  /** Short description. */
  description: string;
  /** Category label (e.g. "MORNING RESET"). */
  category: string;
  /** Category accent color. */
  categoryColor?: string;
  /** Duration in minutes. */
  durationMinutes: number;
  /** Callback when "Start" is tapped. */
  onStart?: () => void;
}

export const RecommendationCard = React.memo(({
  title,
  description,
  category,
  categoryColor = '#F97316',
  durationMinutes,
  onStart,
}: RecommendationCardProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Animated.View
      entering={FadeInDown.delay(320).duration(500).springify()}
    >
      <Pressable
        onPress={onStart}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.surface.primary : '#FFFFFF',
            borderColor: isDark ? colors.border.default : '#E5E7EB',
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${description}. ${durationMinutes} minutes.`}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnail}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="recThumbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDE68A" />
                <Stop offset="100%" stopColor="#F97316" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={14} fill="url(#recThumbGrad)" />
            {/* Sun */}
            <SvgCircle cx={35} cy={30} r={12} fill="#FFFFFF" opacity={0.35} />
            {/* Waves */}
            <Rect x={8} y={52} width={55} height={4} rx={2} fill="#FFFFFF" opacity={0.25} />
            <Rect x={12} y={60} width={47} height={3} rx={1.5} fill="#FFFFFF" opacity={0.18} />
            <Rect x={16} y={66} width={39} height={3} rx={1.5} fill="#FFFFFF" opacity={0.12} />
          </Svg>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}18` }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {category}
            </Text>
          </View>

          <Text
            style={[styles.title, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text
            style={[styles.description, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {description}
          </Text>

          <View style={styles.durationRow}>
            <Clock size={12} color={colors.text.secondary} />
            <Text style={[styles.durationText, { color: colors.text.secondary }]}>
              {durationMinutes} min
            </Text>
          </View>
        </View>

        {/* Start CTA */}
        <Pressable
          onPress={onStart}
          style={[
            styles.startButton,
            {
              borderColor: isDark ? '#8B5CF6' : '#6C4CF1',
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Start ${title}`}
        >
          <Text style={[styles.startText, { color: isDark ? '#8B5CF6' : '#6C4CF1' }]}>
            Start
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
});

RecommendationCard.displayName = 'RecommendationCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    marginBottom: 6,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 4,
  },
  startButton: {
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
  startText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default RecommendationCard;
