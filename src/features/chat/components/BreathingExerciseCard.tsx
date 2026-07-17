import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius as radius } from '@/core/theme/tokens';

interface BreathingExerciseCardProps {
  title?: string;
  content?: string;
  actionLabel?: string;
}

function parseBreathingContent(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const title = lines[0] || undefined;
  let duration: string | undefined;
  let pattern: string | undefined;

  for (const line of lines) {
    if (line.startsWith('Duration:')) {
      duration = line.replace(/^Duration:\s*/i, '');
    } else if (line.startsWith('Pattern:')) {
      pattern = line.replace(/^Pattern:\s*/i, '');
    }
  }

  return { title, duration, pattern };
}

export const BreathingExerciseCard = React.memo(function BreathingExerciseCard({ title: propTitle, content, actionLabel = 'Begin Exercise' }: BreathingExerciseCardProps) {
  const { colors } = useTheme();
  const parsed = content ? parseBreathingContent(content) : { title: undefined, duration: undefined, pattern: undefined };
  const title = propTitle || parsed.title || 'Breathing Exercise';
  const [started, setStarted] = React.useState(false);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (started) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.35, { duration: 1000 }),
          withTiming(1.0, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1000 }),
        ),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [started]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.secondary, borderColor: colors.border.subtle }]}>
      {/* Decorative gradient overlay */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="breathCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.brand.primary} stopOpacity={0.02} />
            <Stop offset="100%" stopColor={colors.brand.secondary} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#breathCardGrad)" rx={radius.xl} />
      </Svg>

      {/* Left accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors.brand.secondary }]} />

      <View style={styles.header}>
        <Animated.View style={[styles.iconCircle, animatedStyle, { borderColor: colors.brand.primary }]}>
          <View style={[styles.iconInner, { backgroundColor: colors.brand.primary }]} />
        </Animated.View>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      </View>

      <View style={styles.infoSection}>
        {parsed.duration ? (
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.text.tertiary }]}>DURATION</Text>
            <Text style={[styles.metaValue, { color: colors.text.secondary }]}>{parsed.duration}</Text>
          </View>
        ) : null}
        {parsed.pattern ? (
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.text.tertiary }]}>PATTERN</Text>
            <Text style={[styles.metaValue, { color: colors.text.secondary }]}>{parsed.pattern}</Text>
          </View>
        ) : null}
      </View>

      {!parsed.duration && !parsed.pattern && content ? (
        <Text style={[styles.description, { color: colors.text.secondary }]}>{content}</Text>
      ) : null}

      {started ? (
        <View style={[styles.instructionBox, { backgroundColor: colors.surface.primary, borderColor: colors.brand.border }]}>
          <Text style={[styles.instruction, { color: colors.brand.primary }]}>
            Breathe with the circle — in, hold, out, pause
          </Text>
        </View>
      ) : null}

      <View style={[styles.divider, { backgroundColor: colors.border.subtle }]} />

      <Pressable
        onPress={() => {
          try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
          setStarted(true);
        }}
        disabled={started}
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: started
              ? colors.border.default
              : pressed
                ? colors.brand.secondary
                : colors.brand.primary,
          },
        ]}
      >
        <Text style={[styles.actionLabel, { color: started ? colors.text.secondary : colors.brand.contrastText }]}>
          {started ? 'In Progress...' : actionLabel}
        </Text>
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
  infoSection: {
    marginBottom: spacing.md,
    gap: 8,
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
  instructionBox: {
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
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

export default BreathingExerciseCard;
