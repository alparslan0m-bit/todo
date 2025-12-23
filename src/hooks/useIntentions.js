/**
 * Custom hook for managing intentions with real-time updates
 * Synchronizes with LocalStorage and triggers re-renders when data changes
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getIntentions,
  addIntention as addIntentionToStorage,
  deleteIntention as deleteIntentionFromStorage
} from '../utils/storage';

export const useIntentions = () => {
  const [intentions, setIntentions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load intentions from storage on component mount
  useEffect(() => {
    const loadIntentions = () => {
      const storedIntentions = getIntentions();
      setIntentions(storedIntentions);
      setLoading(false);
    };
    loadIntentions();
  }, []);

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
    loading,
    addIntention,
    deleteIntention
  };
};
