import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../models';
import * as settingsDB from '../db/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await settingsDB.getSettings();
      if (!data) {
        data = await settingsDB.initializeDefaultSettings();
      }
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (updates: Partial<Omit<Settings, 'id'>>) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await settingsDB.updateSettings(updates);
        setSettings(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update settings');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};

