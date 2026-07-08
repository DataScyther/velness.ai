// src/features/home/components/QuickActionsBar.tsx
//
// Five circular icon buttons for one-tap access to core wellness actions.
// Stagger-animated on mount. Each button: 52×52 circle + label beneath.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Wind,
  BookOpen,
  Sparkles,
  Moon,
  MessageCircle,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { ROUTES } from '@/core/config/routes';

interface QuickAction {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  onPress: () => void;
}

interface QuickActionsBarProps {
  onOpenChat?: () => void;
  onOpenJournal?: () => void;
}

export function QuickActionsBar({ onOpenChat, onOpenJournal }: QuickActionsBarProps) {
  const { colors } = useTheme();

  const actions: QuickAction[] = [
    {
      id: 'breathing',
      label: 'Breathe',
      Icon: Wind,
      color: '#06B6D4',
      onPress: () => {
        // Navigate to breathing exercise when available
        console.log('[QuickActions] Breathing');
      },
    },
    {
      id: 'journal',
      label: 'Journal',
      Icon: BookOpen,
      color: '#8B5CF6',
      onPress: onOpenJournal ?? (() => console.log('[QuickActions] Journal')),
    },
    {
      id: 'meditation',
      label: 'Meditate',
      Icon: Sparkles,
      color: '#F59E0B',
      onPress: () => {
        console.log('[QuickActions] Meditation');
      },
    },
    {
      id: 'sleep',
      label: 'Sleep',
      Icon: Moon,
      color: '#6366F1',
      onPress: () => {
        console.log('[QuickActions] Sleep');
      },
    },
    {
      id: 'chat',
      label: 'AI Chat',
      Icon: MessageCircle,
      color: '#10B981',
      onPress: onOpenChat ?? (() => router.push(ROUTES.TABS.CHAT)),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <Animated.View
          key={action.id}
          entering={FadeInDown.delay(index * 40).duration(400)}
          style={styles.actionWrapper}
        >
          <Pressable
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.circle,
              { backgroundColor: `${action.color}18`, borderColor: `${action.color}25` },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <action.Icon size={22} color={action.color} />
          </Pressable>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            {action.label}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  actionWrapper: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

export default QuickActionsBar;
