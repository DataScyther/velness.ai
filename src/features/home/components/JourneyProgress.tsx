import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface JourneyProgressProps {
  percent: number;
}

export const JourneyProgress = React.memo(({ percent }: JourneyProgressProps) => {
  const animatedPercent = useSharedValue(0);

  useEffect(() => {
    animatedPercent.value = withSpring(percent, { damping: 18, stiffness: 80 });
  }, [percent, animatedPercent]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedPercent.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      {/* Progress track */}
      <View style={styles.track}>
        <Animated.View style={[styles.progressBar, progressStyle]}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#8B5CF6" />
                <Stop offset="100%" stopColor="#06B6D4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#progressGrad)" rx={3} />
          </Svg>
        </Animated.View>
      </View>

      {/* Percentage complete */}
      <Text style={styles.percentText}>{percent}% complete</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  percentText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Geomini, SF Pro Text',
    marginTop: 6,
  },
});

export default JourneyProgress;
