import React from 'react';
import { View } from 'react-native';
import { Home, MessageCircle, Compass, User } from 'lucide-react-native';
import { TabName, useNavigationContext } from './NavigationContext';

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

  // Resolve icon color based on states
  let iconColor: string;
  if (isDisabled) {
    iconColor = colors.text.secondary + '40'; // 25% opacity
  } else if (isActive) {
    iconColor = colors.brand.primary; // Active brand color
  } else if (isPressed) {
    iconColor = colors.brand.primary + 'B3'; // Pressed/active state tint (70% opacity)
  } else {
    iconColor = colors.text.secondary; // Default/Inactive color
  }

  // Choose Lucide icon component
  let IconComponent;
  switch (name) {
    case 'home':
      IconComponent = Home;
      break;
    case 'chat':
      IconComponent = MessageCircle;
      break;
    case 'journey':
      IconComponent = Compass;
      break;
    case 'profile':
      IconComponent = User;
      break;
    default:
      IconComponent = Home;
  }

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}

export default IconWrapper;
