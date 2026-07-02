import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Sparkles, Heart, HelpCircle, Flame } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

interface QuickStarter {
  icon: React.ComponentType<{ size: number; color: string }>;
  text: string;
  color: string;
}

const QUICK_STARTERS: QuickStarter[] = [
  { icon: Heart, text: "I'm feeling a bit overwhelmed today...", color: '#EF4444' },
  { icon: Sparkles, text: "Can we do a quick mindful check-in?", color: '#A78BFA' },
  { icon: Flame, text: "I want to share a small win!", color: '#F59E0B' },
  { icon: HelpCircle, text: "Help me process some thoughts", color: '#06B6D4' },
];

interface EmptyConversationProps {
  onQuickStarterSelect?: (text: string) => void;
}

export function EmptyConversation({ onQuickStarterSelect }: EmptyConversationProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      {/* Greeting */}
      <Text style={[styles.greeting, { color: colors.text.primary }]}>
        {getGreeting()}
      </Text>
      
      <Text style={[styles.prompt, { color: colors.text.secondary }]}>
        {"What's on your mind today?"}
      </Text>

      {/* Quick Starters Grid */}
      <Text style={[styles.suggestionsLabel, { color: colors.text.secondary }]}>
        Suggestions
      </Text>
      <View style={styles.startersGrid}>
        {QUICK_STARTERS.map((starter, index) => {
          const IconComponent = starter.icon;
          return (
            <Pressable
              key={index}
              onPress={() => onQuickStarterSelect?.(starter.text)}
              style={({ pressed }) => [
                styles.starterCard,
                {
                  backgroundColor: pressed ? colors.background.secondary : colors.surface.secondary,
                  borderColor: colors.border.default,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={starter.text}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${starter.color}15` },
                ]}
              >
                <IconComponent size={16} color={starter.color} />
              </View>
              <Text style={[styles.starterText, { color: colors.text.primary }]}>
                {starter.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    width: '100%',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  prompt: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  startersGrid: {
    width: '100%',
    gap: 12,
  },
  starterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  starterText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});

export default EmptyConversation;
