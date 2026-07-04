import React, { useState, useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useUnreadCount } from '@/hooks/realtime/useUnreadCount';
import { NavigationContext, TabName } from './NavigationContext';
import NavigationContainer from './NavigationContainer';
import NavigationItem from './NavigationItem';

// Define tab static config
const TAB_CONFIGS: Record<TabName, { label: string; hint: string }> = {
  home: {
    label: 'Home',
    hint: 'Navigates to the Home dashboard',
  },
  chat: {
    label: 'Chat',
    hint: 'Opens your AI wellness chat conversations',
  },
  journey: {
    label: 'Journey',
    hint: 'Opens your wellness journey and exercises',
  },
  profile: {
    label: 'Profile',
    hint: 'Opens your profile settings and statistics',
  },
};

const mapRouteToTab = (routeName: string): TabName => {
  if (routeName === 'index') return 'home';
  return routeName as TabName;
};

export function BottomNavigation({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme, colors } = useTheme();
  const [pressedTab, setPressedTab] = useState<TabName | null>(null);

  // Retrieve unread counts
  const chatUnread = useUnreadCount();
  
  const profileUnread = 1; // Represents the "Notification" badge count

  // Combine badges into a dictionary
  const badges = useMemo<Partial<Record<TabName, number>>>(() => {
    return {
      chat: chatUnread,
      profile: profileUnread, // Display the Notification badge on Profile tab
    };
  }, [chatUnread, profileUnread]);

  // Support disabled tabs state if needed (currently empty but fully functional)
  const disabledTabs = useMemo<TabName[]>(() => [], []);

  // Find the currently active tab index and name
  const activeRoute = state.routes[state.index];
  const activeTabName = mapRouteToTab(activeRoute.name);

  const activeIndex = useMemo(() => {
    return state.routes.findIndex((route) => mapRouteToTab(route.name) === activeTabName);
  }, [state.routes, activeTabName]);

  // Handle route switching
  const handleTabPress = async (tabName: TabName) => {
    // Map tabName back to the route name
    const targetRoute = state.routes.find((route) => mapRouteToTab(route.name) === tabName);
    if (!targetRoute) return;

    const isFocused = activeTabName === tabName;

    // Trigger subtle physical feedback for tab click
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignored if device/platform does not support Haptics
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(targetRoute.name);
    }
  };

  const contextValue = useMemo(
    () => ({
      activeTab: activeTabName,
      pressedTab,
      setPressedTab,
      disabledTabs,
      badges,
      theme,
      colors,
      onTabPress: handleTabPress,
    }),
    [activeTabName, pressedTab, disabledTabs, badges, theme, colors, state.routes]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      <NavigationContainer activeIndex={activeIndex} totalTabs={state.routes.length}>
        {state.routes.map((route) => {
          const tabName = mapRouteToTab(route.name);
          const config = TAB_CONFIGS[tabName];
          if (!config) return null;

          return (
            <NavigationItem
              key={route.key}
              name={tabName}
              label={config.label}
              hint={config.hint}
            />
          );
        })}
      </NavigationContainer>
    </NavigationContext.Provider>
  );
}

export default BottomNavigation;
