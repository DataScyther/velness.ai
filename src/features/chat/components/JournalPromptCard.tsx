import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius as radius } from '@/core/theme/tokens';
import { BookOpen } from 'lucide-react-native';

interface JournalPromptCardProps {
  title?: string;
  content?: string;
  actionLabel?: string;
}

function parseJournalContent(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const title = lines[0] || undefined;
  const prompt = lines.slice(1).join('\n').trim() || undefined;
  return { title, prompt };
}

export const JournalPromptCard = React.memo(function JournalPromptCard({ title: propTitle, content, actionLabel = 'Write in Journal' }: JournalPromptCardProps) {
  const { colors } = useTheme();
  const parsed = content ? parseJournalContent(content) : { title: undefined, prompt: undefined };
  const title = propTitle || parsed.title || 'Journal Prompt';
  const prompt = parsed.prompt || content || undefined;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}>
      {/* Decorative gradient overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="journalCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={colors.brand.secondary} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#journalCardGrad)" rx={radius.xl} />
      </Svg>

      {/* Left accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors.brand.secondary }]} />

      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.brand.subtle }]}>
          <BookOpen size={15} color={colors.brand.primary} strokeWidth={2.2} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      </View>

      {prompt ? (
        <View style={[styles.promptBox, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
          <Text style={[styles.prompt, { color: colors.text.primary }]}>{prompt}</Text>
        </View>
      ) : null}

      <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
        Take a moment to reflect and write about this prompt.
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border.subtle }]} />

      <Pressable
        onPress={() => {
          try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
        }}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: pressed ? colors.brand.secondary : colors.brand.primary },
        ]}
      >
        <Text style={[styles.actionLabel, { color: colors.brand.contrastText }]}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  promptBox: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: spacing.md,
  },
  actionButton: {
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default JournalPromptCard;
