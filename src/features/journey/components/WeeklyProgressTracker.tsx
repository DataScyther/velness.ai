import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayStatus = 'completed' | 'current' | 'future';

interface WeeklyProgressTrackerProps {
  dayStatuses?: DayStatus[];
  activeDays?: number;
}

export const WeeklyProgressTracker = React.memo(({
  dayStatuses,
  activeDays,
}: WeeklyProgressTrackerProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const statuses = useMemo(() => {
    if (dayStatuses) return dayStatuses;
    const today = new Date().getDay();
    const mondayIndex = today === 0 ? 6 : today - 1;
    return DAYS.map((_, i): DayStatus => {
      if (i < mondayIndex) return 'completed';
      if (i === mondayIndex) return 'current';
      return 'future';
    });
  }, [dayStatuses]);

  const computedActiveDays = useMemo(() => {
    if (activeDays !== undefined) return activeDays;
    return statuses.filter(s => s === 'completed').length;
  }, [activeDays, statuses]);

  const pulseOpacity = useSharedValue(0.3);
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const completedColor = isDark ? '#6366F1' : '#4F46E5';
  const currentColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)';

  return (
    <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
      <View style={[styles.card, { backgroundColor: colors.surface.primary, borderColor: colors.border.default }]}>
        <View style={styles.mainRow}>
          <View style={styles.daysSection}>
            <View style={styles.labelRow}>
              {DAYS.map((day, i) => (
                <Text
                  key={day}
                  style={[
                    styles.dayLabel,
                    {
                      color: statuses[i] === 'future'
                        ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
                        : colors.text.secondary,
                      fontWeight: statuses[i] === 'current' ? '700' : '500',
                    },
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.dotsRow}>
              {statuses.map((status, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <View style={styles.connectorContainer}>
                      <View
                        style={[
                          styles.connector,
                          { backgroundColor: statuses[i - 1] !== 'future' && status !== 'future'
                            ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                            : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')
                          },
                        ]}
                      />
                    </View>
                  )}

                  <View style={styles.dotWrapper}>
                    {status === 'completed' && (
                      <View style={[styles.dot, { backgroundColor: completedColor }]} />
                    )}
                    {status === 'current' && (
                      <View style={styles.currentDotContainer}>
                        <Animated.View
                          style={[
                            styles.pulseRing,
                            { borderColor: currentColor },
                            pulseStyle,
                          ]}
                        />
                        <View style={[styles.dot, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }]} />
                      </View>
                    )}
                    {status === 'future' && (
                      <View style={[styles.emptyDot, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />
                    )}
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={[styles.statsBlock, { borderLeftColor: colors.border.default }]}>
            <Text style={[styles.statsNumber, { color: colors.text.primary }]}>
              {computedActiveDays}
              <Text style={[styles.statsTotal, { color: colors.text.secondary }]}>/7</Text>
            </Text>
            <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>active</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

WeeklyProgressTracker.displayName = 'WeeklyProgressTracker';

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysSection: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingRight: spacing.xs,
  },
  dayLabel: {
    fontSize: 10,
    textAlign: 'center',
    width: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.xs,
  },
  connectorContainer: {
    flex: 1,
    height: 2,
    justifyContent: 'center',
  },
  connector: {
    height: 2,
    borderRadius: 1,
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  currentDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  pulseRing: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  emptyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  statsBlock: {
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    marginLeft: spacing.xs,
    alignItems: 'center',
    minWidth: 56,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  statsTotal: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  statsLabel: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default WeeklyProgressTracker;
