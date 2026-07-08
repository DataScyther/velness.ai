// src/features/home/components/SmartRecommendationCard.tsx
//
// Contextual recommendation that explains WHY — not just WHAT.
// Replaces generic "Recommended" with a reason → recommendation narrative.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface SmartRecommendationCardProps {
  reason: string;        // "Because you've been studying CBT"
  title: string;         // "Thought Logging"
  subtitle?: string;     // Optional description
  onPress: () => void;
}

export function SmartRecommendationCard({
  reason,
  title,
  subtitle,
  onPress,
}: SmartRecommendationCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.surface.primary,
            borderColor: colors.border.default,
          },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Recommendation: ${title}. ${reason}`}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: `${colors.brand.primary}18` }]}>
            <Sparkles size={14} color={colors.brand.primary} />
          </View>
          <Text style={[styles.reasonText, { color: colors.text.secondary }]}>
            {reason}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border.default }]} />

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.textBlock}>
            <Text style={[styles.label, { color: colors.brand.primary }]}>
              We recommend
            </Text>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          <View style={[styles.cta, { backgroundColor: colors.brand.primary }]}>
            <Text style={styles.ctaText}>Try it</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    lineHeight: 17,
    letterSpacing: 0.1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.6,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SmartRecommendationCard;
