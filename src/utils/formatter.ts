import { I18nManager, Platform } from "react-native";
import * as langKeys from "../locales/en/translation.json";
import {useAppTranslation} from "../hooks/useAppTranslation";
import { TamamOfferResponse } from "../apis/types/payment";
import i18n from '../utils/i18n';

export const getLocaleInitials = () => {
  return i18n.language === 'ar' ? 'ar' : 'en';
};

import { DeepKeys } from "../types";
import dayjs from 'dayjs';
import { transformSync } from "@babel/core";

export const arabicToEnglishDigits = (input: string): string => {
	const arabicNumbers: Record<string, string> = {
		'٠': '0',
		'١': '1',
		'٢': '2',
		'٣': '3',
		'٤': '4',
		'٥': '5',
		'٦': '6',
		'٧': '7',
		'٨': '8',
		'٩': '9',
	};
	return input?.replace(/[٠-٩]/g, (d) => arabicNumbers?.[d] || d);
};

export const isRTL = () => {
  if (Platform.OS === "web") {
    return document?.dir === "rtl";
  }

  return I18nManager.isRTL;
};

export const locales = {
	en: 'en',
	ar: 'ar',
} as const;

export const Language: Record<Locale, string> = {
	en: 'English',
	ar: 'العربية',
};

export type Locale = keyof typeof locales;

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

export const formattedNumber = (phoneNum: string) => {
	return phoneNum.replace(/^0/, '');
};

export const formatSecondsToMinsSecs = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
	return `${pad(minutes)}:${pad(secs)}`;
};

/**
 * Masks a value into format: first 2 chars + ' *** ' + last 5 chars
 * Example: "0512345678912412" → "05 *** 12412"
 */
export const maskPhoneNumber = (
	value: string | number | null | undefined,
	options?: {
		start?: number;
		end?: number;
		mask?: string;
	},
): string => {
	if (value === null || value === undefined) return '';

	const str = String(value).trim();
	if (!str) return '';

	const start = options?.start ?? 2;
	const end = options?.end ?? 5;
	const mask = options?.mask ?? '***';

	if (str.length <= start + end) {
		return str; // nothing to mask
	}

	const startPart = str.slice(0, start);
	const endPart = str.slice(-end);

	return `${startPart} ${mask} ${endPart}`;
};


export const replaceWithDigits = (text: string) => {
	return text.replace(/\D/g, '');
};

export const getDateComponentsFromTimestamp = (date: number) => {
	const momentDate = dayjs(date).locale(getLocaleInitials());
	const dayTextSmall = momentDate.format('ddd');
	const dayText = momentDate.format('dddd');
	const dayInMonth = momentDate.date();
	const month = momentDate.format('MMM');
	const iscurrentDate = momentDate.isSame(new Date(), 'day');
  const { t } = useAppTranslation();
	const dateText = iscurrentDate
		? t('label.today')
		: isRTL()
			? `${dayTextSmall}, ${month} ${dayInMonth}`
			: ` ${month} ${dayInMonth} , ${dayTextSmall}`;
	const dateTextSmall = `${month} ${dayInMonth}`;

	return {
		dayTextSmall,
		dayText,
		dayInMonth,
		month,
		dateText,
		dateTextSmall,
	};
};

type DeliveryInfo = {
	deliveryDate: string;
	deliveryMonth: string;
	deliveryYear: string;
	deliverySlot: string;
};

export const formatDeliverySlot = ({
	deliveryDate,
	deliveryMonth,
	deliveryYear,
	deliverySlot,
}: DeliveryInfo): string => {
	const date = new Date(
		Number(deliveryYear),
		Number(deliveryMonth) - 1,
		Number(deliveryDate),
	);

	// "16 Jan 2026"
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	// Convert → "16 Jan, 2026"
	const dateWithComma = formattedDate.replace(
		/(\d{2}\s[A-Za-z]{3})\s(\d{4})/,
		'$1, $2',
	);

	// ⬅️ deliverySlot kept EXACTLY as received
	return `${dateWithComma} ${deliverySlot}`;
};

export const getMinValueForTamam = (tamamOffer: TamamOfferResponse[]) => {
	return Math.min(...tamamOffer.map((item) => item.emi_value));
};

export const formatDate = (date?: string, format?: string) => {
	return dayjs(date)
		.locale(getLocaleInitials())
		.format(format || 'DD MMM, YYYY');
};

export const getDateFromTimestamp = (date: number, translation: any) => {
	const momentDate = dayjs(date).locale(getLocaleInitials());
	const dayName = momentDate.format('ddd');
	const dayInMonth = momentDate.date();
	const month = momentDate.format('MMM');

	const iscurrentDate = momentDate.isSame(new Date(), 'day');

	const displayText = iscurrentDate
		? translation.t('label.today')
		: isRTL()
			? `${dayName}, ${month} ${dayInMonth}`
			: ` ${month} ${dayInMonth} , ${dayName}`;
	return displayText;
};
