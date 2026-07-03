/**
 * WeeklyProgressTracker — Day-by-day activity tracker
 *
 * Displays:
 *  - Day labels (Mon–Sun) across the top
 *  - Teal checkmark circles for completed days
 *  - Dashed connectors between days
 *  - Current day highlighted with a pulsing ring
 *  - Future days as empty/gray circles
 *  - "X/7 days active" stat block on right
 */

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
import Svg, { Circle as SvgCircle, Line, Path } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/core/theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayStatus = 'completed' | 'current' | 'future';

interface WeeklyProgressTrackerProps {
  /** Array of 7 statuses, one per day starting from Monday. */
  dayStatuses?: DayStatus[];
  /** Total active days this week. */
  activeDays?: number;
}

export const WeeklyProgressTracker = React.memo(({
  dayStatuses,
  activeDays,
}: WeeklyProgressTrackerProps) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Default: compute from current day of week
  const statuses = useMemo(() => {
    if (dayStatuses) return dayStatuses;

    const today = new Date().getDay(); // 0=Sun, 1=Mon...
    const mondayIndex = today === 0 ? 6 : today - 1; // Convert to Mon-based

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

  // Pulse animation for current day
  const pulseOpacity = useSharedValue(0.4);
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const completedColor = '#10B981';
  const currentColor = isDark ? '#8B5CF6' : '#6C4CF1';
  const futureColor = isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB';
  const connectorColor = isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.25)';
  const futureConnectorColor = isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB';

  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(500).springify()}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.surface.primary : '#FFFFFF',
            borderColor: isDark ? colors.border.default : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.mainRow}>
          {/* Days tracker */}
          <View style={styles.daysSection}>
            {/* Day labels */}
            <View style={styles.labelRow}>
              {DAYS.map((day, i) => (
                <Text
                  key={day}
                  style={[
                    styles.dayLabel,
                    {
                      color: statuses[i] === 'future'
                        ? (isDark ? 'rgba(255,255,255,0.25)' : '#9CA3AF')
                        : (isDark ? 'rgba(255,255,255,0.6)' : '#4B5563'),
                      fontWeight: statuses[i] === 'current' ? '700' : '500',
                    },
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Dots row */}
            <View style={styles.dotsRow}>
              {statuses.map((status, i) => (
                <React.Fragment key={i}>
                  {/* Connector (between dots, not before first) */}
                  {i > 0 && (
                    <View style={styles.connectorContainer}>
                      <View
                        style={[
                          styles.connector,
                          {
                            borderColor: statuses[i - 1] === 'completed' && status !== 'future'
                              ? connectorColor
                              : futureConnectorColor,
                            borderStyle: 'dashed',
                          },
                        ]}
                      />
                    </View>
                  )}

                  {/* Day dot */}
                  <View style={styles.dotWrapper}>
                    {status === 'completed' && (
                      <View style={[styles.dot, styles.completedDot, { backgroundColor: completedColor }]}>
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      </View>
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
                        <View style={[styles.dot, styles.currentDot, { borderColor: currentColor }]}>
                          <View style={[styles.currentDotInner, { backgroundColor: currentColor }]} />
                        </View>
                      </View>
                    )}

                    {status === 'future' && (
                      <View style={[styles.dot, styles.futureDot, { backgroundColor: futureColor }]} />
                    )}
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Stats block */}
          <View style={[styles.statsBlock, { backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)', borderColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.12)' }]}>
            <View style={styles.statsTextRow}>
              <Text style={[styles.statsNumber, { color: isDark ? '#10B981' : '#059669' }]}>
                {computedActiveDays}
              </Text>
              <Text style={[styles.statsTotal, { color: colors.text.secondary }]}>
                {' '}/ 7
              </Text>
            </View>
            <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
              days active
            </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDot: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  currentDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  pulseRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  currentDot: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  currentDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  futureDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  statsBlock: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    minWidth: 72,
  },
  statsTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  statsTotal: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default WeeklyProgressTracker;
