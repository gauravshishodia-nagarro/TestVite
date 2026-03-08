import { I18nManager, Platform } from "react-native";
import * as langKeys from "../locales/en/translation.json";

import { DeepKeys } from "../types";

export const isRTL = () => {
  if (Platform.OS === "web") {
    return document?.dir === "rtl";
  }

  return I18nManager.isRTL;
};

export const formatPriceToDecimalPrice = (value: string | number): string => {
  const num =
    typeof value === "string"
      ? Number.parseFloat(value.replace(/,/g, "").trim())
      : value;

  if (Number.isNaN(num)) return "Invalid price";

  return num?.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatPhone = (input: string, startWithZero = false) => {
  const cleaned = input?.replace(/\D/g, ""); // Remove non-digits
  const match = startWithZero
    ? cleaned?.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
    : cleaned?.match(/^(\d{0,2})(\d{0,3})(\d{0,4})$/);

  if (!match) return input;

  const [, part1, part2, part3] = match;
  if (part3) return `${part1} ${part2} ${part3}`;
  if (part2) return `${part1} ${part2}`;
  if (part1) return `${part1}`;
  return "";
};
