import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ENTranslation from "../locales/en/translation.json";
import ARTranslation from "../locales/ar/translation.json";

i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      en: {
        translation: ENTranslation,
      },
      ar: {
        translation: ARTranslation,
      },
    },
  });
export default i18n;
