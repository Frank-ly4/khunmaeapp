import { getDatabase } from './index';
import { Settings } from '../models';

const SETTINGS_ID = '1';

export const getSettings = async (): Promise<Settings | null> => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.getFirstAsync<Settings>(
      'SELECT * FROM settings WHERE id = ?',
      [SETTINGS_ID]
    )
      .then((settings) => resolve(settings || null))
      .catch((error) => reject(error));
  });
};

export const updateSettings = async (
  updates: Partial<Omit<Settings, 'id'>>
): Promise<Settings> => {
  const db = getDatabase();
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.stallName !== undefined) {
    fields.push('stallName = ?');
    values.push(updates.stallName);
  }
  if (updates.ownerName !== undefined) {
    fields.push('ownerName = ?');
    values.push(updates.ownerName);
  }
  if (updates.currency !== undefined) {
    fields.push('currency = ?');
    values.push(updates.currency);
  }
  if (updates.promptpayId !== undefined) {
    fields.push('promptpayId = ?');
    values.push(updates.promptpayId || null);
  }
  
  if (fields.length === 0) {
    const existing = await getSettings();
    if (!existing) {
      return initializeDefaultSettings();
    }
    return existing;
  }
  
  values.push(SETTINGS_ID);
  
  return new Promise((resolve, reject) => {
    // First check if settings exist
    getSettings()
      .then((existing) => {
        if (!existing) {
          // Create new settings with updates
          return initializeDefaultSettings(updates);
        } else {
          // Update existing settings
          return db
            .runAsync(
              `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`,
              values
            )
            .then(() => getSettings())
            .then((updated) => {
              if (!updated) {
                throw new Error('Settings not found after update');
              }
              return updated;
            });
        }
      })
      .then((settings) => resolve(settings))
      .catch((error) => reject(error));
  });
};

export const initializeDefaultSettings = async (
  overrides?: Partial<Omit<Settings, 'id'>>
): Promise<Settings> => {
  const db = getDatabase();
  
  const defaultSettings: Settings = {
    id: SETTINGS_ID,
    stallName: overrides?.stallName || '',
    ownerName: overrides?.ownerName || '',
    currency: overrides?.currency || 'THB',
    promptpayId: overrides?.promptpayId,
  };
  
  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO settings (id, stallName, ownerName, currency, promptpayId)
       VALUES (?, ?, ?, ?, ?)`,
      [
        defaultSettings.id,
        defaultSettings.stallName,
        defaultSettings.ownerName,
        defaultSettings.currency,
        defaultSettings.promptpayId || null,
      ]
    )
      .then(() => resolve(defaultSettings))
      .catch((error) => reject(error));
  });
};

