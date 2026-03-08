import { useTranslation } from "react-i18next";
import * as langKeys from "../locales/en/translation.json";
import { DeepKeys } from "../types";

export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();

  const strings = (key: DeepKeys<typeof langKeys> | (string & {})) => t(key);

  const getCurrentLocale = () => i18n.language;

  return {
    t: strings,
    i18n,
    getCurrentLocale,
  };
};
