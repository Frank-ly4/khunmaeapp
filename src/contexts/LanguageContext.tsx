import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LanguageCode } from '../i18n';
import { getSettings, initializeDefaultSettings, updateSettings } from '../db/settings';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  loading: boolean;
  needsSelection: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [loading, setLoading] = useState(true);
  const [needsSelection, setNeedsSelection] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let settings = await getSettings();
        if (!settings) {
          settings = await initializeDefaultSettings();
        }

        const lang = (settings.language as LanguageCode | undefined) || 'en';
        setLanguageState(lang);
        // If no language stored, prompt user to choose
        setNeedsSelection(!settings.language);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setLanguage = useCallback(async (lang: LanguageCode) => {
    setLanguageState(lang);
    setNeedsSelection(false);
    await updateSettings({ language: lang });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading, needsSelection }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};


