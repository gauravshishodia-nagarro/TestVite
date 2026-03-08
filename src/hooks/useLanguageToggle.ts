import { I18nManager, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useSoftResetStore } from "../stores/softResetStore";

export const useLanguageToggle = () => {
  const { i18n } = useTranslation();
  const navigation = useNavigation();
  const softReset = useSoftResetStore((s) => s.softReset);

  const toggleLanguage = async (fromLangSelection = false) => {
    const currentLocale = i18n.language;
    const nextLocale = currentLocale === "ar" ? "en" : "ar";
    const isRTL = nextLocale === "ar";

    useUserPreferenceStore
      .getState()
      .updateUserPreferences({ language: nextLocale });

    await i18n.changeLanguage(nextLocale);

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
    }

    // 🌐 WEB: update <html>
    if (Platform.OS === "web") {
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
    }

    if (fromLangSelection) return;

    navigation.dispatch(
      CommonActions.reset({
        index: 0, // Index of the active route in the routes array
        routes: [
          { name: "Home" }, // The destination screen
        ],
      })
    );
    softReset();
  };

  return {
    toggleLanguage,
  };
};
