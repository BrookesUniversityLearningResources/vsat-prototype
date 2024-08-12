import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: require('./resources'),
    detection: {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lng',
    },
    supportedLngs: ['en', 'no'],
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
