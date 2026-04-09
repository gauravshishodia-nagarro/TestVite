import { CardResponse } from '../apis/types/payment';
export const getCardImage = (card?: CardResponse) => {
	if (card?.is_apple_pay) {
		return require('../../public/images/applePay.webp');
	} else {
		switch (card?.card_type?.toLowerCase()) {
			case 'visa':
				return require('../../public/images/visa-blue-bg.webp');
			case 'mada':
				return require('../../public/images/ic_mada.png');
			case 'amex':
				return require('../../public/images/ic_amex.png');
			case 'mastercard':
				return require('../../public/images/payment_option_mastercard.webp');
		}

		// case 'googlePay':
		// 	return require('@/src/assets/images/googlePay.webp');
	}
};
