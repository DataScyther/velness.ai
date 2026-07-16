import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/core/theme';

export interface WeeklyHistoryHeaderProps {
  selectedWeek: number;
  onWeekChange: (offset: number) => void;
  dateRangeText: string;
  dominantEmoji: string;
  dominantLabel: string;
  hasDominant: boolean;
  trendText: string;
  isBetter: boolean;
  isWorse: boolean;
  hasTrend: boolean;
}

export const WeeklyHistoryHeader = React.memo(
  ({
    selectedWeek,
    onWeekChange,
    dateRangeText,
    dominantEmoji,
    dominantLabel,
    hasDominant,
    trendText,
    isBetter,
    isWorse,
    hasTrend,
  }: WeeklyHistoryHeaderProps) => {
    const { colors } = useTheme();

    const trendColor = isBetter ? colors.success : isWorse ? colors.danger : colors.text.secondary;

    const canGoForward = selectedWeek > 0;
    const canGoBack = true;

    return (
      <View style={styles.header}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface.primary,
              borderColor: colors.border.default,
            },
          ]}
        >
          <View style={styles.contentRow}>
            <Pressable
              onPress={() => canGoBack && onWeekChange(1)}
              disabled={!canGoBack}
              accessibilityRole="button"
              accessibilityLabel="Previous week"
              style={({ pressed }) => [
                styles.chevron,
                {
                  borderColor: colors.border.default,
                  backgroundColor: colors.surface.secondary,
                },
                !canGoBack && styles.chevronDisabled,
                pressed && canGoBack && styles.chevronPressed,
              ]}
            >
              <ChevronLeft
                size={20}
                color={canGoBack ? colors.text.primary : colors.text.tertiary}
              />
            </Pressable>

            <View style={styles.copyBlock}>
              <View style={styles.metaRow}>
                <View style={[styles.statusDot, { backgroundColor: colors.brand.primary }]} />

                <Text
                  style={[
                    styles.eyebrow,
                    { color: isBetter || isWorse ? trendColor : colors.text.tertiary },
                  ]}
                >
                  THIS WEEK
                </Text>
              </View>

              <Text style={[styles.title, { color: colors.text.primary }]}>
                Mood Insights
              </Text>

              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                {dateRangeText}
              </Text>

              <View style={styles.dominantRow}>
                <Text style={styles.dominantEmoji}>{hasDominant ? dominantEmoji : '–'}</Text>
                <Text
                  style={[
                    styles.dominantLabel,
                    {
                      color: hasDominant ? colors.text.primary : colors.text.tertiary,
                    },
                  ]}
                >
                  {hasDominant ? dominantLabel : 'No data'}
                </Text>
              </View>

              {hasTrend && (
                <Text style={[styles.trendText, { color: trendColor }]}>{trendText}</Text>
              )}
            </View>

            <Pressable
              onPress={() => canGoForward && onWeekChange(-1)}
              disabled={!canGoForward}
              accessibilityRole="button"
              accessibilityLabel="Next week"
              style={({ pressed }) => [
                styles.chevron,
                {
                  borderColor: colors.border.default,
                  backgroundColor: colors.surface.secondary,
                },
                !canGoForward && styles.chevronDisabled,
                pressed && canGoForward && styles.chevronPressed,
              ]}
            >
              <ChevronRight
                size={20}
                color={canGoForward ? colors.text.primary : colors.text.tertiary}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

WeeklyHistoryHeader.displayName = 'WeeklyHistoryHeader';

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },

  card: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 18,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },

  chevronPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },

  chevronDisabled: {
    opacity: 0.35,
  },

  copyBlock: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginRight: spacing.xs,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 27,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: spacing.xs,
    letterSpacing: 0.1,
    lineHeight: 17,
  },

  dominantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  dominantEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },

  dominantLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
    letterSpacing: 0.1,
  },
});
