/**
 * DailyQuote — Typography component rendering an inspirational wellness quote.
 *
 * Designed with a clean glassmorphism left-accent border and dynamic font scaling.
 * Supports screen readers (VoiceOver/TalkBack) and accessible touch targets.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface DailyQuoteProps {
  /** Optional dynamic quote text. If omitted, falls back to a curated collection */
  quote?: string;
}

const DEFAULT_QUOTES = [
  "Small steps today become lasting change tomorrow.",
  "Your wellness is a journey, not a destination. Take a breath.",
  "Give yourself permission to pause, reflect, and just be.",
  "Every moment is a fresh beginning to nurture your mind.",
  "Quiet the mind, and the soul will speak."
];

export function DailyQuote({ quote }: DailyQuoteProps) {
  const { colors } = useTheme();
  // Memoize fallback selection so it doesn't change on standard renders
  const activeQuote = useMemo(() => {
    if (quote) return quote;
    const index = new Date().getDate() % DEFAULT_QUOTES.length;
    return DEFAULT_QUOTES[index];
  }, [quote]);

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={styles.wrapper}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Daily reflection: ${activeQuote}`}
    >
      <View style={[styles.accentBar, { backgroundColor: colors.brand.primary }]} />
      <Text
        style={styles.quoteText}
        className="text-text-secondary font-sans"
        allowFontScaling={true}
      >
        "{activeQuote}"
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 2,
    marginBottom: 8,
  },
  accentBar: {
    width: 3,
    height: '70%',
    borderRadius: 2,
    marginRight: 10,
    opacity: 0.8,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    flex: 1,
  },
});

export default DailyQuote;
