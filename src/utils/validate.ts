import { useAppTranslation } from "../hooks/useAppTranslation";
export type AuthInputType =
	| 'email'
	| 'phone'
	| 'nationalId'
	| 'passport'
	| 'unknown';

export function detectAndValidateAuthInput(input: string): {
	isValid: boolean;
	type: AuthInputType;
	errorMessage?: string;
} {
	const value = input.trim();
	const {t} = useAppTranslation();

	if (validateEmail(value)) {
		return { isValid: true, type: 'email' };
	}

	if (validatePhone(value)) {
		return { isValid: true, type: 'phone' };
	}

	const nationalIdType = validateNationalId(value);
	if (nationalIdType !== -1) {
		return { isValid: true, type: 'nationalId' };
	}

	// If nothing matched, return detailed error
	if (/^\d+$/.test(value) && value.length !== 10 && !value?.startsWith('05')) {
		return {
			isValid: false,
			type: 'nationalId',
			errorMessage: t('error.enterCorrectNationalID'),
		};
	}

	if (/^\d+$/.test(value) && value?.startsWith('05')) {
		return {
			isValid: false,
			type: 'phone',
			errorMessage: t('error.errorPhone'),
		};
	}

	if (/@/.test(value)) {
		return {
			isValid: false,
			type: 'email',
			errorMessage: t('error.errorEmail'),
		};
	}

	return {
		isValid: false,
		type: 'unknown',
		errorMessage: '',
	};
}

export function validateEmail(email: string) {
	const re =
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re?.test(String(email)?.toLowerCase());
}

export function validatePhone(phone = '', withInitial = '05') {
	const isOnlyDigits =
		withInitial.at(0) === '0' ? /^\d{10}$/.test(phone) : /^\d{9}$/.test(phone); // ensures exactly 10 digits when start with 0 and 9 when starts with 5

	const startsWith05 = phone?.startsWith(withInitial);
	return isOnlyDigits && startsWith05;
}

export function validateNationalId(id: string): number {
	// Special override case
	if (id === '1111111111') return 1;

	const trimmedId = id?.trim();

	// Validate numeric and length
	if (!/^\d{10}$/.test(trimmedId)) return -1;

	const type = trimmedId[0]; // First digit
	if (type !== '1' && type !== '2') return -1;

	let sum = 0;

	for (let i = 0; i < 10; i++) {
		const digit = Number.parseInt(trimmedId[i], 10);
		if (Number.isNaN(digit)) return -1;

		if (i % 2 === 0) {
			const double = digit * 2;
			sum += Math.floor(double / 10) + (double % 10);
		} else {
			sum += digit;
		}
	}

	// If sum is not divisible by 10, it's invalid
	if (sum % 10 !== 0) return -1;

	// 1 = Saudi, 2 = Non-Saudi
	return Number(type);
}

export function isValidIqamahID(iqamahID = '') {
	const regExp = /^[0-9\u0660-\u0669]{10}$/;
	return regExp.test(iqamahID);
}

export function validatePassport(passport = ''): boolean {
	const trimmed = passport?.trim()?.toUpperCase();

	// General rules for many countries (including Saudi passports)
	const passportRegex = /^[A-Z0-9]{8,9}$/;

	return passportRegex?.test(trimmed);
}

export function isValidCharacter(text: string) {
	const regExp = /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z ]*$/;
	return text && regExp?.test(text);
}

export function isValidSIMNumber(simNumber = '') {
	const regExp = /^[0-9\u0660-\u0669]{19}$/;
	return regExp.test(simNumber);
}

export const validateCardNumber = (num: string) =>
	/^[0-9]{13,19}$/.test(num.replace(/\s+/g, ''));

export const validateExpiry = (date: string) => {
	if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date)) return false;
	const [month, year] = date.split('/');
	const expiry = new Date(`20${year}`, Number(month), 0);
	return expiry > new Date();
};
export const validateCvv = (val: string): boolean => {
	// Must be 3 or 4 digits and not all zeros
	if (!/^\d{3,4}$/.test(val)) return false;
	if (val === '000' || val === '0000') return false;
	return true;
};
export const validateName = (val: string) => /^[A-Za-z ]+$/.test(val.trim());

export const validateCard = (card_number: string) => {
	let card_type = '';
	let card_validity = true;
	let card_length = 0;
	// Visa
	const visa_regex = /^4[0-9]{0,15}$/;

	// MasterCard
	const mastercard_regex = /^5$|^5[0-5][0-9]{0,16}$/;

	// American Express
	const amex_regex = /^3$|^3[47][0-9]{0,13}$/;

	//mada
	const mada_regex = new RegExp(`^${bins.mada}`);

	//meeza
	const meeza_regex = new RegExp(bins.meeza, 'gm');

	if (card_number?.match(mada_regex)) {
		card_type = 'mada';
		card_length = 16;
	}
	//  as per our discussion with Abdulaziz we do not have the meeza card
	// else if (card_number.match(meeza_regex)) {
	// 	card_type = 'meeza';
	// 	card_length = 19;
	// }
	else if (card_number.match(visa_regex)) {
		card_type = 'visa';
		card_length = 16;
	} else if (card_number.match(mastercard_regex)) {
		card_type = 'mastercard';
		card_length = 16;
	} else if (card_number.match(amex_regex)) {
		card_type = 'amex';
		card_length = 15;
	} else {
		card_validity = false;
	}
	// if (card_number?.length < 15) {
	if (card_number.replace(/\s+/g, '').length !== card_length) {
		card_validity = false;
	} else {
		card_validity = validateCardNumber(card_number);
	}

	return {
		card_type,
		validity: card_validity,
		card_length,
	};
};

const bins = {
	mada: '440647|440795|446404|457865|968208|457997|474491|636120|417633|468540|468541|468542|468543|968201|446393|409201|458456|484783|462220|455708|410621|455036|486094|486095|486096|504300|440533|489318|489319|445564|968211|410685|406996|432328|428671|428672|428673|968206|446672|543357|434107|407197|407395|412565|431361|604906|521076|529415|535825|543085|524130|554180|549760|968209|524514|529741|537767|535989|536023|513213|520058|558563|588982|589005|531095|530906|532013|968204|422817|422818|422819|428331|483010|483011|483012|589206|968207|419593|439954|530060|531196|420132|222300',
	meeza: '507803[0-6][0-9]|507808[3-9][0-9]|507809[0-9][0-9]|507810[0-2][0-9]',
};
