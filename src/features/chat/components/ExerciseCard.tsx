import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius as radius } from '@/core/theme/tokens';
import { Wind } from 'lucide-react-native';

interface ExerciseCardProps {
  title?: string;
  duration?: string;
  actionLabel?: string;
}

export const ExerciseCard = React.memo(function ExerciseCard({ title = 'Breathing Exercise', duration = '60 sec', actionLabel = 'Start' }: ExerciseCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}>
      {/* Decorative gradient overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="exerciseCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={colors.brand.secondary} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#exerciseCardGrad)" rx={radius.xl} />
      </Svg>

      {/* Left accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors.brand.primary }]} />

      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.brand.subtle }]}>
          <Wind size={15} color={colors.brand.primary} strokeWidth={2.2} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.metaRow}>
          <Text style={[styles.metaLabel, { color: colors.text.tertiary }]}>DURATION</Text>
          <Text style={[styles.metaValue, { color: colors.text.secondary }]}>{duration}</Text>
        </View>
      </View>

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
  infoSection: {
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    width: 90,
  },
  metaValue: {
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
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

export default ExerciseCard;
