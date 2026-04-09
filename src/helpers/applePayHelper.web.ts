import axios from 'axios';
import { PaymentEvent } from '../utils/payfort';

const APPLE_PAY_VERSION_NUMBER = 3;
export const APPLE_MERCHANT_IDENTIFIER = 'merchant.com.sa.maana.dev';

export enum PaymentStatus {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	CANCEL = 'CANCEL',
}

export type LineDetails = {
	orderId: string;
	lineId: string;
};

type PerformPaymentProps = {
	currencyCode: string;
	label: string;
	amount: number;
	token?: string;
	baseURL: string;
	// lindeDetails and userId is required for multiline renewal
	lindeDetails?: LineDetails[];
	userId?: string;
};
type GetOnValidateMerchantProps = {
	event: { validationURL: any };
	session: {
		completeMerchantValidation: (arg0: any) => void;
		abort: () => void;
	};
	token?: string;
	baseURL: string;
	groupId?: string;
	userId?: string;
};
type GetOnPaymentAuthorizedProps = {
	resolve: { (value: unknown): void; (arg0: number): void };
	reject: any;
	event: {
		payment: {
			token: {
				paymentData: any;
				paymentMethod: any;
				transactionIdentifier: string;
			};
		};
	};
	session: { completePayment: (arg0: any) => void };
	token?: string;
	baseURL: string;
	groupId?: string;
	userId?: string;
};
const getPaymentRequestObject = (
	currencyCode: string,
	label: string,
	amount: string,
): any => {
	return {
		currencyCode: currencyCode,
		countryCode: 'SA',
		total: {
			label: label,
			amount: amount,
		},
		supportedNetworks: ['mada', 'masterCard', 'visa'],
		merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
	};
};
const getOnCancel = (resolve: {
	(value: unknown): void;
	(arg0: number): void;
}) => {
	return () => {
		console.log('APPLE_PAY', 'CANCEL');
		resolve(PaymentStatus.CANCEL);
	};
};
const getOnPaymentAuthorized = async ({
	resolve,
	reject,
	event,
	session,
	token,
	baseURL,
	groupId,
	userId,
}: GetOnPaymentAuthorizedProps): Promise<any> => {
	// amount must be provided in cents
	const { paymentData, paymentMethod, transactionIdentifier } =
		event.payment.token || {};
	const applePayload = {
		data: paymentData.data || '',
		signature: paymentData.signature || '',
		transactionId: transactionIdentifier || '',
		ephemeralPublicKey: paymentData.header.ephemeralPublicKey || '',
		publicKeyHash: paymentData.header.publicKeyHash || '',
		displayName: paymentMethod.displayName || '',
		network: paymentMethod.network || '',
		type: paymentMethod.type || '',
	};
	try {
		const data: any = {
			applePayPayload: applePayload,
			linkId: userId,
		};
		console.log('Apple_PAY_PAYMENT', 'getOnPaymentAuthorized1', data);

		const _response = await axios({
			method: 'POST',
			baseURL,
			url: groupId
				? `/payment-v2/payment/guest/orders/groupPay/${groupId}`
				: `/payment-v2/payment/guest/orders/pay/${token}`,
			data,
			headers: { 'Content-Type': 'application/json' },
		});
		console.log('Apple_PAY_PAYMENT', 'getOnPaymentAuthorized2', _response);
		const response = _response.data;
		if (
			response.isSuccessful &&
			response.eventName === PaymentEvent.PAYMENT_SUCCESSFUL
		) {
			session.completePayment((window as any).ApplePaySession.STATUS_SUCCESS);
			resolve(PaymentStatus.SUCCESS);
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			session.completePayment(window.ApplePaySession.STATUS_FAILURE);
			resolve(PaymentStatus.FAILURE);
		}
	} catch (err: any) {
		session.completePayment((window as any)?.ApplePaySession?.STATUS_FAILURE);
		reject(err);
	}
};
const getOnValidateMerchant = async ({
	event,
	session,
	token,
	baseURL,
	groupId,
	userId,
}: GetOnValidateMerchantProps): Promise<void> => {
	try {
		const data = {
			validationURL: event.validationURL,
			linkId: userId,
			initiativeContext: window.location.hostname,
		};
		console.log('APPLE_PAY', 'getOnValidateMerchant1', data);
		const _response = await axios({
			method: 'POST',
			baseURL,
			url: groupId
				? `/payment-v2/applepay/guest/groupTransactionSession/create/${groupId}`
				: `/payment-v2/applepay/guest/session/create/${token}`,
			data,
			headers: { 'Content-Type': 'application/json' },
		});
		console.log('APPLE_PAY', 'getOnValidateMerchant2', _response);
		const response = _response.data;
		if (_response.status === 200) {
			const { data: sessionFromServer } = response;
			console.log('Merchant session passed to Apple', sessionFromServer);

			session.completeMerchantValidation(sessionFromServer);
		} else {
			console.error('Merchant validation failed, aborting');
			session.abort();
		}
	} catch (err: any) {
		console.log('APPLE_PAY', 'getOnValidateMerchant3', err);
		session.abort();
	}
};
export const performPayment = ({
	currencyCode,
	label,
	amount,
	token,
	baseURL,
}: PerformPaymentProps): Promise<any> => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const session = new window.ApplePaySession(
			APPLE_PAY_VERSION_NUMBER,
			getPaymentRequestObject(currencyCode, label, Number(amount).toFixed(2)),
		);
		session.onvalidatemerchant = (event: any) => {
			console.log('APPLE_PAY', 'onvalidatemerchant fired');
			getOnValidateMerchant({
				event,
				session,
				token,
				baseURL,
			});
		};
		session.onpaymentauthorized = (event: any) => {
			console.log('APPLE_PAY', 'onpaymentauthorized fired');
			getOnPaymentAuthorized({
				resolve,
				reject,
				event,
				session,
				token,
				baseURL,
			});
		};
		session.oncancel = getOnCancel(resolve);
		console.log('canMakePayments:', window?.ApplePaySession?.canMakePayments());

		session.begin();
	});
};
export const performGroupPayment = ({
	currencyCode,
	label,
	amount,
	token,
	baseURL,
	lindeDetails, // groupOrderId required in multiline renewal
	userId, // userId is required in multiline renewal
}: PerformPaymentProps): Promise<any> => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const session = new window.ApplePaySession(
			APPLE_PAY_VERSION_NUMBER,
			getPaymentRequestObject(currencyCode, label, Number(amount).toFixed(2)),
		);
		axios({
			method: 'POST',
			baseURL,
			url: '/telco-provision/external/multiline/grouporder/create',
			data: lindeDetails,
		})
			.then((response) => {
				const groupOrderId = response?.data?.data?.groupOrderId;

				if (!groupOrderId) {
					reject(new Error('groupOrderId not found in response'));
					return;
				}
				session.onvalidatemerchant = (event: any) => {
					console.log('APPLE_PAY', 'onvalidatemerchant fired');
					getOnValidateMerchant({
						event,
						session,
						token,
						baseURL,
						userId,
						groupId: groupOrderId,
					});
				};
				session.onpaymentauthorized = (event: any) => {
					console.log('APPLE_PAY', 'onpaymentauthorized fired');
					getOnPaymentAuthorized({
						resolve,
						reject,
						event,
						session,
						token,
						baseURL,
						userId,
						groupId: groupOrderId,
					});
				};
				session.oncancel = getOnCancel(resolve);
				console.log(
					'canMakePayments:',
					window?.ApplePaySession?.canMakePayments(),
				);

				session.begin();
			})
			.catch((err) => reject(err));
	});
};
export async function hasApplePayWithActiveCard(
	merchantIdentifier?: string,
): Promise<boolean> {
	if (typeof window === 'undefined' || !(window as any).ApplePaySession)
		return false;

	const APS = (window as any).ApplePaySession;

	// canMakePayments may be a boolean or a function that returns a Promise/boolean depending on browser.
	let canMakePayments = false;
	try {
		if (typeof APS.canMakePayments === 'function') {
			canMakePayments = await Promise.resolve(APS.canMakePayments());
		} else {
			// older behavior: property as boolean
			canMakePayments = Boolean(APS.canMakePayments);
		}
	} catch (e) {
		console.warn('canMakePayments check failed', e);
		canMakePayments = false;
	}

	console.log('Apple1', 'canMakePayments', canMakePayments);

	if (!canMakePayments) return false;

	// If merchantIdentifier provided and API available, check if user has an active card for your merchant
	if (
		merchantIdentifier &&
		typeof APS.canMakePaymentsWithActiveCard === 'function'
	) {
		try {
			return await Promise.resolve(
				APS.canMakePaymentsWithActiveCard(merchantIdentifier),
			);
		} catch (e) {
			console.warn('canMakePaymentsWithActiveCard failed', e);
			return false;
		}
	}

	// If we can't check active card, fall back to canMakePayments
	return true;
	// example to call above method
	/*
  hasApplePayWithActiveCard(merchantId).then((available) => {
  if (available) {
    // safe to show Apple Pay button and create ApplePaySession
  } else {
    // show fallback payment option
  }
});
  */
}

export function isApplePayAvailable() {
	return (
		typeof window !== 'undefined' &&
		!!(window as any).ApplePaySession &&
		(window as any).ApplePaySession.canMakePayments()
	);
}

// export async function isApplePayJsAvailable(merchantIdentifier: string) {
// 	if (typeof window === 'undefined') return false;

// 	const ApplePaySession = (window as any).ApplePaySession;

// 	// Must exist AND be a constructor (Safari only)
// 	if (!ApplePaySession || typeof ApplePaySession !== 'function') {
// 		return false;
// 	}

// 	try {
// 		const canPay =
// 			await ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);

// 		return !!canPay;
// 	} catch {
// 		return false;
// 	}
// }
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const existsApplePayJsApi = () => {
	return new Promise((resolve, reject) => {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const enabled =
				window?.ApplePaySession && window?.ApplePaySession?.canMakePayments();
			console.log('Apple', 'existsApplePayJsApi', enabled);
			resolve(enabled);
		} catch (err) {
			console.log('Apple', 'existsApplePayJsApi', 'error', err);
			reject(err);
		}
	});
};

export const isApplePayJsAvailable = (): any => {
	return existsApplePayJsApi().then(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return window?.ApplePaySession?.canMakePaymentsWithActiveCard(
			APPLE_MERCHANT_IDENTIFIER,
		);
	});
};
