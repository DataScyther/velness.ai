import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

function SkeletonLine({ width, delay }: { width: number | string; delay: number }) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.skeletonLine, { width: width as any, backgroundColor: colors.surface.secondary, borderColor: colors.border.default }, animStyle]}
    />
  );
}

export function ConversationSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.surface.secondary }]} />
        <View style={styles.bubble}>
          <SkeletonLine width="80%" delay={0} />
          <SkeletonLine width="60%" delay={200} />
        </View>
      </View>
      <View style={[styles.row, styles.userRow]}>
        <View style={[styles.userBubble, { backgroundColor: colors.brand.primary + '20' }]}>
          <SkeletonLine width="70%" delay={100} />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.surface.secondary }]} />
        <View style={styles.bubble}>
          <SkeletonLine width="90%" delay={200} />
          <SkeletonLine width="50%" delay={400} />
          <SkeletonLine width="75%" delay={600} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16 },
  row: { flexDirection: 'row', marginVertical: 8, alignItems: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  bubble: { gap: 8, width: '70%' },
  userBubble: { width: '60%', borderRadius: 16, padding: 12 },
  skeletonLine: { height: 14, borderRadius: 7, borderWidth: 0 },
});

export default ConversationSkeleton;
