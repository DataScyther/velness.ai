import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius as radius } from '@/core/theme/tokens';
import { BrainCircuit } from 'lucide-react-native';

interface CBTExerciseCardProps {
  title?: string;
  content?: string;
  actionLabel?: string;
}

function parseCBTContent(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const title = lines[0] || undefined;
  let negativeThought: string | undefined;
  let reframe: string | undefined;

  for (const line of lines) {
    if (line.startsWith('Negative Thought:')) {
      negativeThought = line.replace(/^Negative Thought:\s*/i, '');
    } else if (line.startsWith('Reframe:')) {
      reframe = line.replace(/^Reframe:\s*/i, '');
    }
  }

  return { title, negativeThought, reframe };
}

export const CBTExerciseCard = React.memo(function CBTExerciseCard({ title: propTitle, content, actionLabel = 'Start Exercise' }: CBTExerciseCardProps) {
  const { colors } = useTheme();
  const parsed = content ? parseCBTContent(content) : { title: undefined, negativeThought: undefined, reframe: undefined };
  const title = propTitle || parsed.title || 'CBT Exercise';
  const showThoughtRecord = parsed.negativeThought || parsed.reframe;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}>
      {/* Decorative gradient overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="cbtCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={colors.brand.secondary} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#cbtCardGrad)" rx={radius.xl} />
      </Svg>

      {/* Left accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors.brand.primary }]} />

      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.brand.subtle }]}>
          <BrainCircuit size={16} color={colors.brand.primary} strokeWidth={2.2} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      </View>

      {showThoughtRecord ? (
        <View style={styles.thoughtRecordsContainer}>
          {parsed.negativeThought ? (
            <View style={[styles.thoughtSection, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
              <Text style={[styles.thoughtLabel, { color: colors.text.tertiary }]}>Negative Thought</Text>
              <Text style={[styles.thoughtContent, { color: colors.text.primary }]}>{parsed.negativeThought}</Text>
            </View>
          ) : null}
          {parsed.reframe ? (
            <View style={[styles.thoughtSection, styles.reframeSection, { backgroundColor: colors.brand.subtle + '30', borderColor: colors.brand.border }]}>
              <Text style={[styles.thoughtLabel, { color: colors.brand.primary }]}>Reframed Thought</Text>
              <Text style={[styles.thoughtContent, { color: colors.text.primary }]}>{parsed.reframe}</Text>
            </View>
          ) : null}
        </View>
      ) : content ? (
        <Text style={[styles.description, { color: colors.text.secondary }]}>{content}</Text>
      ) : null}

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
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  thoughtRecordsContainer: {
    gap: 10,
    marginBottom: spacing.md,
  },
  thoughtSection: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  reframeSection: {
    borderLeftWidth: 3,
  },
  thoughtLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  thoughtContent: {
    fontSize: 14,
    lineHeight: 20,
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
    alignSelf: 'flex-start',
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

export default CBTExerciseCard;
