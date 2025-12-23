
import { useCallback } from 'react';

/**
 * Hook to trigger haptic feedback on supported devices.
 * Uses the Vibration API.
 */
export const useHaptic = () => {
  const triggerHaptic = useCallback((pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { triggerHaptic };
};
