import { en } from './en';
import { th } from './th';

export type LanguageCode = 'en' | 'th';

const dictionaries: Record<LanguageCode, Record<string, string>> = {
  en,
  th,
};

export const translate = (key: string, language: LanguageCode): string => {
  const dict = dictionaries[language] || dictionaries.en;
  return dict[key] ?? dictionaries.en[key] ?? key;
};


