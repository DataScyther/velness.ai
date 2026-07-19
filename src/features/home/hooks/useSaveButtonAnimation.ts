import { useRef, useEffect } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';

interface UseSaveButtonAnimationOptions {
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    overshootClamping: boolean;
  };
}

/**
 * Custom hook to manage save button animation with debouncing
 * to prevent shadow flickering during rapid state changes.
 */
export function useSaveButtonAnimation(
  isVisible: boolean,
  options: UseSaveButtonAnimationOptions = {}
) {
  const {
    springConfig = { damping: 28, stiffness: 220, mass: 0.9, overshootClamping: true },
  } = options;

  const visibility = useSharedValue(0);
  const prevVisibleRef = useRef(isVisible);

  useEffect(() => {
    const prevVisible = prevVisibleRef.current;
    prevVisibleRef.current = isVisible;

    // Only animate if the visibility state actually changed
    if (prevVisible !== isVisible) {
      visibility.value = withSpring(isVisible ? 1 : 0, springConfig);
    }
  }, [isVisible, visibility, springConfig]);

  return visibility;
}
