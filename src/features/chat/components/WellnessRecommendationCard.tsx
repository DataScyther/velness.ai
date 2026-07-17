import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius as radius } from '@/core/theme/tokens';
import { Sparkles } from 'lucide-react-native';

interface WellnessRecommendationCardProps {
  title?: string;
  content?: string;
  actionLabel?: string;
}

function parseWellnessContent(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const title = lines[0] || undefined;
  let tip: string | undefined;
  const descriptionLines: string[] = [];

  for (const line of lines.slice(1)) {
    if (line.startsWith('Tip:')) {
      tip = line.replace(/^Tip:\s*/i, '');
    } else {
      descriptionLines.push(line);
    }
  }

  const description = descriptionLines.join('\n').trim() || undefined;
  return { title, description, tip };
}

export const WellnessRecommendationCard = React.memo(function WellnessRecommendationCard({ title: propTitle, content, actionLabel = 'Try This' }: WellnessRecommendationCardProps) {
  const { colors } = useTheme();
  const parsed = content ? parseWellnessContent(content) : { title: undefined, description: undefined, tip: undefined };
  const title = propTitle || parsed.title || 'Wellness Tip';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}>
      {/* Decorative gradient overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="wellnessCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={colors.brand.secondary} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#wellnessCardGrad)" rx={radius.xl} />
      </Svg>

      {/* Left accent line */}
      <View style={[styles.accentLine, { backgroundColor: '#10B981' }]} />

      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: '#E6F4EA' }]}>
          <Sparkles size={15} color="#137333" strokeWidth={2.2} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      </View>

      {parsed.description ? (
        <Text style={[styles.description, { color: colors.text.secondary }]}>{parsed.description}</Text>
      ) : null}

      {parsed.tip ? (
        <View style={[styles.tipBox, { backgroundColor: colors.surface.primary, borderLeftColor: '#10B981', borderColor: colors.border.default }]}>
          <Text style={[styles.tipLabel, { color: '#137333' }]}>Tip</Text>
          <Text style={[styles.tipText, { color: colors.text.primary }]}>{parsed.tip}</Text>
        </View>
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
  tipBox: {
    padding: spacing.md,
    borderLeftWidth: 3,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  tipLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  tipText: {
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

export default WellnessRecommendationCard;
