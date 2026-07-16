/**
 * AIMessageBubble
 *
 * Full-width card bubble for assistant messages.
 *
 * Phase 6 — Velness-native Interaction Layer
 *
 * Instead of generic 👍/👎/Copy, uses:
 * - Save Reflection
 * - Continue Later
 * - Share Insight
 * - Ask Follow-up
 * - Regenerate
 * - Copy (in overflow menu)
 *
 * Grouping rules (iMessage-style):
 *  - Avatar shown only on the FIRST message in a group
 *  - Timestamp shown only on the LAST message in a group
 *  - Corner radius flattened on the shared edge for non-first grouped messages
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { BookmarkPlus, Clock, Share2, MessageCircle, RefreshCw, Clipboard, ThumbsUp, ThumbsDown, Copy, Volume2, VolumeX, AudioLines } from 'lucide-react-native';
import * as ExpoClipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { BaseMessageBubble } from './BaseMessageBubble';
import { MessageContent } from './MessageContent';
import { MessageTimestamp } from './MessageTimestamp';
import { MessageActionSheet } from './MessageActionSheet';
import { getBubbleRadius, getBubbleMarginBottom } from '../styles/bubbleVariants';
import { chat, chatTypography, motion, spacing } from '@/core/theme/tokens';
import { useAppStore } from '@/core/store/useAppStore';
import { speechSynthesisAvailable, speak, stop } from '@/services/speech/SpeechSynthesis';
import type { Message } from '../types/Message';

const FEATHER_PATH =
  'M512 0C460.22 3.56 96.44 38.2 71.01 287.61c-3.09 26.66-4.84 53.44-5.99 80.24l178.87-178.69c6.25-6.25 16.4-6.25 22.65 0s6.25 16.38 0 22.63L7.04 471.03c-9.38 9.37-9.38 24.57 0 33.94 9.38 9.37 24.59 9.37 33.98 0l57.13-57.07c42.09-.14 84.15-2.53 125.96-7.36 53.48-5.44 97.02-26.47 132.58-56.54H255.74l146.79-48.88c11.25-14.89 21.37-30.71 30.45-47.12h-81.14l106.54-53.21C500.29 132.86 510.19 26.26 512 0z';

interface AIMessageBubbleProps {
  message: Message;
  onCopy?: (text: string) => void;
  onFeedback?: (type: 'helpful' | 'unhelpful') => void;
  onDelete?: (id: string) => void;
  onRegenerate?: () => void;
  onSaveReflection?: (messageId: string) => void;
  onContinueLater?: (messageId: string) => void;
  onShareInsight?: (messageId: string) => void;
  onAskFollowUp?: (messageId: string) => void;
  /** Is this message preceded by another assistant message? */
  isGrouped?: boolean;
  /** Is this the first in its group? (avatar shown) */
  isFirst?: boolean;
  /** Is this the last in its group? (timestamp shown) */
  isLast?: boolean;
  /** Tracks message IDs already spoken so historical messages aren't re-read */
  spokenIdsRef?: React.MutableRefObject<Set<string>>;
}

function IconActionButton({
  onPress,
  icon,
  accessibilityLabel,
}: {
  onPress: () => void;
  icon: React.ReactNode;
  accessibilityLabel: string;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    scale.value = withSpring(0.88, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 250 });
    });
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={styles.actionBtn}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to activate"
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
}

export const AIMessageBubble = React.memo(function AIMessageBubble({
  message,
  onCopy,
  onFeedback,
  onDelete,
  onRegenerate,
  onSaveReflection,
  onContinueLater,
  onShareInsight,
  onAskFollowUp,
  isGrouped = false,
  isFirst = true,
  isLast = true,
  spokenIdsRef,
}: AIMessageBubbleProps) {
  const { colors } = useTheme();
  const [copyOpacity, setCopyOpacity] = useState(1);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const voiceEnabled = useAppStore((state) => state.ui.voiceEnabled);
  const setVoiceEnabled = useAppStore((state) => state.setVoiceEnabled);

  // Derive clean, spoken-friendly text. Structured types use line-prefixed
  // labels (e.g. "Title:", "Question:") which we strip; plain markdown keeps
  // its content but loses markdown symbols.
  const getSpokenText = useCallback((msg: Message): string => {
    const text = msg.content ?? '';
    switch (msg.type) {
      case 'markdown':
      case 'reflection':
      case 'journal':
      case 'wellness':
      case 'insight':
      case 'summary':
      case 'resource':
      case 'action':
      case 'question':
      case 'exercise':
      case 'breathing':
      case 'cbt-exercise':
      default:
        return text
          .replace(/^Title:\s*/gim, '')
          .replace(/^Question:\s*/gim, '')
          .replace(/^Label:\s*/gim, '')
          .replace(/^Insight:\s*/gim, '')
          .replace(/^Description:\s*/gim, '')
          .replace(/^Source:\s*/gim, '')
          .replace(/^URL:\s*/gim, '')
          .replace(/[#*`>_-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
    }
  }, []);

  // Auto-speak when the global toggle is on (and this is a freshly-arrived
  // assistant message, not a restored/historical one).
  useEffect(() => {
    if (message.role !== 'assistant') return;
    if (message.status !== 'complete') return;
    if (!voiceEnabled || !speechSynthesisAvailable) return;
    if (spokenIdsRef?.current.has(message.id)) return;

    const spokenText = getSpokenText(message);
    if (!spokenText) return;

    spokenIdsRef?.current.add(message.id);
    setIsSpeaking(true);
    speak(spokenText, {
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    return () => {
      stop();
      setIsSpeaking(false);
    };
  }, [message.id, message.status, message.content, voiceEnabled, spokenIdsRef, getSpokenText]);

  const handleSpeakToggle = useCallback(() => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      return;
    }
    const spokenText = getSpokenText(message);
    if (!spokenText) return;
    spokenIdsRef?.current.add(message.id);
    setIsSpeaking(true);
    speak(spokenText, {
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [isSpeaking, message, getSpokenText, spokenIdsRef]);

  const showAvatar = !isGrouped || isFirst;
  const showTimestamp = !isGrouped || isLast;

  const messageType = message.type;

  const handleCopy = useCallback(async () => {
    if (!message.content) return;
    try {
      await ExpoClipboard.setStringAsync(message.content);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    onCopy?.(message.content);
    setCopyOpacity(0.7);
    setTimeout(() => setCopyOpacity(1), 200);
  }, [message.content, onCopy]);

  const handleSaveReflection = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onSaveReflection?.(message.id);
  }, [message.id, onSaveReflection]);

  const handleContinueLater = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onContinueLater?.(message.id);
  }, [message.id, onContinueLater]);

  const handleShareInsight = useCallback(async () => {
    if (!message.content) return;
    try {
      await Share.share({ message: message.content, title: 'Insight from Velness' });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onShareInsight?.(message.id);
  }, [message.content, message.id, onShareInsight]);

  const handleAskFollowUp = useCallback(() => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onAskFollowUp?.(message.id);
  }, [message.id, onAskFollowUp]);

  const handleLike = useCallback(() => {
    setFeedback((prev) => (prev === 'like' ? null : 'like'));
    onFeedback?.('helpful');
  }, [onFeedback]);

  const handleDislike = useCallback(() => {
    setFeedback((prev) => (prev === 'dislike' ? null : 'dislike'));
    onFeedback?.('unhelpful');
  }, [onFeedback]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActionSheetVisible(true);
  }, []);

  const actionSheetActions = [
    { label: 'Copy', icon: <Clipboard size={16} color={colors.text.primary} />, onPress: handleCopy },
    ...(messageType === 'reflection' || messageType === 'insight'
      ? [{ label: 'Save Reflection', icon: <BookmarkPlus size={16} color={colors.text.primary} />, onPress: handleSaveReflection }]
      : []),
    { label: 'Continue Later', icon: <Clock size={16} color={colors.text.primary} />, onPress: handleContinueLater },
    { label: 'Share Insight', icon: <Share2 size={16} color={colors.text.primary} />, onPress: handleShareInsight },
    { label: 'Ask Follow-up', icon: <MessageCircle size={16} color={colors.text.primary} />, onPress: handleAskFollowUp },
    ...(onRegenerate
      ? [{ label: 'Regenerate', icon: <RefreshCw size={16} color={colors.text.primary} />, onPress: onRegenerate }]
      : []),
    ...(onDelete
      ? [{ label: 'Delete', icon: <Clipboard size={16} color={colors.danger} />, onPress: () => onDelete(message.id), destructive: true }]
      : []),
  ];

  const radiusStyle = getBubbleRadius('assistant', { isGrouped, isFirst, isLast });
  const marginBottom = getBubbleMarginBottom(isGrouped && !isLast);

  return (
    <BaseMessageBubble
      role="assistant"
      containerStyle={[
        styles.container,
        { backgroundColor: colors.surface.secondary, marginBottom },
        radiusStyle,
      ]}
    >
      {/* Avatar + label — only shown for first in group */}
      {showAvatar && (
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Svg width={28} height={28} style={StyleSheet.absoluteFillObject}>
              <Defs>
                <LinearGradient id="rainbowGradAB" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#E9D5FF" />
                  <Stop offset="50%" stopColor="#C4B5FD" />
                  <Stop offset="100%" stopColor="#A78BFA" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={14} fill="url(#rainbowGradAB)" />
            </Svg>
            <Svg width={14} height={14} viewBox="0 0 512 512">
              <Path d={FEATHER_PATH} fill="#FFFFFF" />
            </Svg>
          </View>
          <Text style={[styles.brandLabel, { color: colors.text.primary }]}>Velness</Text>
        </View>
      )}

      <Pressable
        onLongPress={handleLongPress}
        style={{ opacity: copyOpacity }}
        accessibilityHint="Long press for more options"
      >
        <View>
          <MessageContent message={message} />
        </View>
      </Pressable>

      {/* Timestamp — only shown for last in group */}
      {showTimestamp && (
        <MessageTimestamp date={message.createdAt} style={styles.timestampBelow} />
      )}

      {/* Inline reaction + action buttons */}
      {message.content ? (
        <View style={styles.actionsRow}>
          <IconActionButton
            onPress={handleLike}
            icon={<ThumbsUp size={18} color={feedback === 'like' ? colors.brand.primary : colors.text.secondary} />}
            accessibilityLabel="Like this response"
          />
          <IconActionButton
            onPress={handleDislike}
            icon={<ThumbsDown size={18} color={feedback === 'dislike' ? colors.brand.primary : colors.text.secondary} />}
            accessibilityLabel="Dislike this response"
          />
          <IconActionButton
            onPress={handleCopy}
            icon={<Copy size={18} color={colors.text.secondary} />}
            accessibilityLabel="Copy response to clipboard"
          />
          <IconActionButton
            onPress={() => setVoiceEnabled(!voiceEnabled)}
            icon={voiceEnabled ? (
              <AudioLines size={18} color={colors.brand.primary} />
            ) : (
              <AudioLines size={18} color={colors.text.secondary} />
            )}
            accessibilityLabel="Toggle voice responses"
          />
          {speechSynthesisAvailable && (
            <IconActionButton
              onPress={handleSpeakToggle}
              icon={isSpeaking ? (
                <VolumeX size={18} color={colors.brand.primary} />
              ) : (
                <Volume2 size={18} color={colors.text.secondary} />
              )}
              accessibilityLabel={isSpeaking ? 'Stop speaking this response' : 'Read this response aloud'}
            />
          )}
        </View>
      ) : null}

      <MessageActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        actions={actionSheetActions}
      />
    </BaseMessageBubble>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: chat.bubble.paddingHAI,
    paddingVertical: chat.bubble.paddingVAI,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  timestampBelow: {
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  actionBtn: {
    width: 36,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
