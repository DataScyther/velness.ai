/**
 * JourneySectionHeader — Section header styled for the Journey screen
 *
 * Unlike the shared SectionHeader (uppercase, small), the Journey screen
 * prototype uses sentence-case, bold, larger section titles.
 *
 * Examples: "Continue where you left off", "Explore practices"
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/core/theme';

interface JourneySectionHeaderProps {
  /** Section title in sentence case. */
  title: string;
  /** Optional action text (e.g. "View all", "Refresh ↻"). */
  actionText?: string;
  /** Callback when action text is tapped. */
  onActionPress?: () => void;
  /** Style override for the container. */
  style?: ViewStyle;
}

export const JourneySectionHeader = React.memo(({
  title,
  actionText,
  onActionPress,
  style,
}: JourneySectionHeaderProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {title}
      </Text>
      {actionText && onActionPress && (
        <Pressable
          onPress={onActionPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text style={[styles.actionText, { color: isDark ? '#A78BFA' : '#6C4CF1' }]}>
            {actionText}
          </Text>
        </Pressable>
      )}
    </View>
  );
});

JourneySectionHeader.displayName = 'JourneySectionHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default JourneySectionHeader;
