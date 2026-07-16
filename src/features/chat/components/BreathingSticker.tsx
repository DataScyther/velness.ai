import React from 'react';
import {
  Wind, Square, Leaf, Footprints, PersonStanding, Cloud, Heart,
  Sparkles, Moon, Zap, HeartHandshake, Target, Brain, Sun, Feather,
  Activity, Image as ImageIcon, MessageCircle, Smartphone, Star,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export type StickerKind =
  | 'breath' | 'box' | '478' | 'ground' | 'body' | 'worry'
  | 'gratitude' | 'reframe' | 'winddown' | 'reset' | 'compassion'
  | 'focus' | 'anxiety' | 'intention' | 'letgo' | 'heartbeat'
  | 'visualize' | 'name' | 'detox' | 'confidence';

type IconComp = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const ICONS: Record<StickerKind, IconComp> = {
  breath: Wind,
  box: Square,
  '478': Leaf,
  ground: Footprints,
  body: PersonStanding,
  worry: Cloud,
  gratitude: Heart,
  reframe: Sparkles,
  winddown: Moon,
  reset: Zap,
  compassion: HeartHandshake,
  focus: Target,
  anxiety: Brain,
  intention: Sun,
  letgo: Feather,
  heartbeat: Activity,
  visualize: ImageIcon,
  name: MessageCircle,
  detox: Smartphone,
  confidence: Star,
};

interface BreathingStickerProps {
  kind: StickerKind;
  color: string;
  /** Icon render size in points. */
  size?: number;
}

// Renders only the icon — no canvas, tile, or border behind it. The icon
// carries its own color and sits at full quality, optically centered.
export const BreathingSticker = React.memo(function BreathingSticker({
  kind,
  color,
  size = 28,
}: BreathingStickerProps) {
  const Icon = ICONS[kind] ?? Wind;
  return <Icon size={size} color={color} strokeWidth={2.2} />;
});

export default BreathingSticker;
