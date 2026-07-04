import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Route, UserRound } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { TabName, useNavigationContext } from './NavigationContext';

function PremiumChatIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 1.66.45 3.22 1.24 4.56L3 21l4.44-1.24A8.97 8.97 0 0 0 12 21a9 9 0 0 0 9-9z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 9h8M8 13h6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PremiumHomeIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3l9 7.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 9v11h14V9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 20v-5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface IconWrapperProps {
  name: TabName;
  isActive: boolean;
  isPressed: boolean;
  isDisabled: boolean;
  size?: number;
}

export function IconWrapper({
  name,
  isActive,
  isPressed,
  isDisabled,
  size = 22,
}: IconWrapperProps) {
  const { colors } = useNavigationContext();

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (name === 'chat' && isActive) {
      pulse.value = withRepeat(
        withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
    return () => {
      pulse.value = 1;
    };
  }, [isActive, name]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  let iconColor: string;
  if (isDisabled) {
    iconColor = colors.text.secondary + '40';
  } else if (isActive) {
    iconColor = colors.text.primary;
  } else if (isPressed) {
    iconColor = colors.text.primary + 'B3';
  } else {
    iconColor = colors.text.secondary;
  }

  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <PremiumHomeIcon size={size} color={iconColor} />;
      case 'chat':
        return <PremiumChatIcon size={size} color={iconColor} />;
      case 'journey':
        return <Route size={size} color={iconColor} strokeWidth={1.2} />;
      case 'profile':
        return <UserRound size={size} color={iconColor} strokeWidth={1.2} />;
      default:
        return <PremiumHomeIcon size={size} color={iconColor} />;
    }
  };

  const iconElement = renderIcon();

  if (name === 'chat') {
    return (
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={animatedStyle}>
          {iconElement}
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      {iconElement}
    </View>
  );
}

export default IconWrapper;
