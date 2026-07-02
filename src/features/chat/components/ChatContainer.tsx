import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Sparkles, Heart, HelpCircle, Flame } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

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

interface ChatContainerProps {
  messages: any[];
  onQuickStarterPress?: (text: string) => void;
  children?: React.ReactNode;
}

export function ChatContainer({
  messages,
  onQuickStarterPress,
  children,
}: ChatContainerProps) {
  const { colors } = useTheme();
  const isEmpty = messages.length === 0;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        isEmpty && styles.emptyScrollContent,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          {/* Decorative Glow Background */}
          <View style={styles.glowCircle} />
          
          <View style={[styles.avatarGlowCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <Text style={styles.emojiLogo}>🧠</Text>
          </View>

          <Text style={[styles.title, { color: '#FFFFFF' }]}>
            Neeva's Conversation Space
          </Text>
          
          <Text style={styles.subtitle}>
            Your safe space for emotional support and reflection. Share whatever is on your mind, without judgement.
          </Text>

          {/* Quick Starters Grid */}
          <View style={styles.startersGrid}>
            {QUICK_STARTERS.map((starter, index) => {
              const IconComponent = starter.icon;
              return (
                <Pressable
                  key={index}
                  onPress={() => onQuickStarterPress?.(starter.text)}
                  style={({ pressed }) => [
                    styles.starterCard,
                    {
                      backgroundColor: pressed ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      borderColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
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
                  <Text style={[styles.starterText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                    {starter.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.messagesList}>
          {children}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0B0B12',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    top: '10%',
    zIndex: -1,
  },
  avatarGlowCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  emojiLogo: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 36,
    maxWidth: width * 0.85,
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
  messagesList: {
    flex: 1,
    gap: 16,
  },
});

export default ChatContainer;
