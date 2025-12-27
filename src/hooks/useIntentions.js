/**
 * Custom hook for managing intentions with real-time updates
 * Synchronizes with LocalStorage and triggers re-renders when data changes
 * Optimized: Lazy initialization for instant load (no useEffect delay)
 */

import { useState, useCallback } from 'react';
import {
  getIntentions,
  addIntention as addIntentionToStorage,
  deleteIntention as deleteIntentionFromStorage
} from '../utils/storage';

export const useIntentions = () => {
  // Lazy initialization: Load from localStorage immediately on first render
  const [intentions, setIntentions] = useState(() => getIntentions());

  // Add a new intention
  const addIntention = useCallback((intention) => {
    const success = addIntentionToStorage(intention);
    if (success) {
      setIntentions(prevIntentions => [...prevIntentions, intention]);
    }
    return success;
  }, []);

  // Delete an intention
  const deleteIntention = useCallback((intention) => {
    const success = deleteIntentionFromStorage(intention);
    if (success) {
      setIntentions(prevIntentions =>
        prevIntentions.filter(i => i !== intention)
      );
    }
    return success;
  }, []);

  return {
    intentions,
    addIntention,
    deleteIntention
  };
};
