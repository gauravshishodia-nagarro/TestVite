import { Platform } from 'react-native';

const TOKENIZATION = 'TOKENIZATION';
const LANG = 'en';
const CURRENCY = 'SAR';

enum PaymentEvent {
	PAYMENT_CARD_VALIDATION_COMPLETED = 'PAYMENT_CARD_VALIDATION_COMPLETED',
	PAYMENT_CARD_VALIDATION_TOKENIZATION_FAILED = 'PAYMENT_CARD_VALIDATION_TOKENIZATION_FAILED',
	PAYMENT_CARD_VALIDATION_FAILED = 'PAYMENT_CARD_VALIDATION_FAILED',
	PAYMENT_CARD_TOKENIZATION_FAILED = 'PAYMENT_CARD_TOKENIZATION_FAILED',
	PAYMENT_TRANSACTIONS_DECLINED = 'PAYMENT_TRANSACTIONS_DECLINED',
	PAYMENT_INVALID_EXPIRY_DATE = 'PAYMENT_INVALID_EXPIRY_DATE',
	PAYMENT_CARD_EXPIRED = 'PAYMENT_CARD_EXPIRED',
	PAYMENT_INSUFFICIENT_FUNDS = 'PAYMENT_INSUFFICIENT_FUNDS',
	SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG',

	// This we added for getting the event of PAYMENT_3D_NEEDED
	PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
	PAYMENT_3D_NEEDED = 'PAYMENT_3D_NEEDED',
}

const getCredentials = () => ({
	PAYFORT_ACCESS_CODE: process.env.EXPO_PUBLIC_PAYFORT_UAT_ACCESS_CODE ?? '',
	PAYFORT_MERCHANT_IDENTIFIER: process.env.EXPO_PUBLIC_PAYFORT_DEV_MERCHANT_IDENTIFIER ?? '',
	PAYFORT_SHA_REQUEST: process.env.EXPO_PUBLIC_PAYFORT_UAT_SHA_REQUEST ?? '',
});

const createHash = async (_string: string) => {
	if (Platform.OS === 'web') {
		const encoder = new TextEncoder();
		const data = encoder.encode(_string);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}
	const Crypto = await import('expo-crypto');
	return await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		_string,
	);
};

const createSignature = async (
	passphrase: string,
	object: Record<string, any>,
) => {
	let signatureText = '';
	const keys = Object.keys(object).sort();

	for (const k of keys) {
		signatureText += `${k}=${object[k]}`;
	}

	const finalText = passphrase + signatureText + passphrase;
	return await createHash(finalText);
};

export {
	TOKENIZATION,
	getCredentials,
	createSignature,
	LANG,
	CURRENCY,
	PaymentEvent,
};
