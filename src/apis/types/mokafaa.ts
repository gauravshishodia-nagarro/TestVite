import { Language } from '@/src/stores/userPreferencesStore';

export interface MokafaaTermsResponse {
	TermsAndCondition: TermsAndCondition;
	Rules: Rules;
}

export interface TermsAndCondition {
	id: string;
	filed_name: string;
	en_values: string[];
	type: string;
	ar_values: string[];
	created_at: string;
	modified_at: string;
}

export interface Rules {
	id: string;
	filed_name: string;
	en_values: string[];
	type: string;
	ar_values: string[];
	created_at: string;
	modified_at: string;
}

export interface MokafaaEnrollPayload {
	language: Language;
	mobile: string;
}

export interface MokafaaEnrollResponse {
	enrollmentId: string;
	initialTimeInSecond: number;
}

export interface MokafaaEnrollVerifyPayload {
	enrollmentId: string;
	otp: string;
	language: Language;
}

export interface MokafaaEnrollResendPayload {
	enrollmentId: string;
	language: string;
}
export interface SendReedemOTPPayload {
	mobile: string;
	currency: string;
	language: string;
}

export interface SendReedeemOTPResponse {
	requestID: string;
	otp: Otp;
	message: string;
	status: number;
	multiplyingFactor: number;
}

export interface Otp {
	currency: string;
	otp_token_expired_in_min: number;
	otp_token: string;
}

export interface RedeemPointPyload {
	amount: string;
	otpValue: string;
	language: string;
	mobile: string;
	isDefaultMobileNumber: boolean;
	orderId?: string;
	groupOrderId?: string;
}

export interface RedeemPointResponse {
	requestID: string;
	merchant: string;
	transactionDate: string;
	transactionID: number;
	transactionType: string;
	pointsAmount: number;
	message: string;
	status: number;
}

type Values = {
	title: string;
	subtitle: string;
};

export type WhyLinkingContent = {
	title: string;
	values: Values[];
};

export interface MokafaaRulesResponse {
	why_linking_content: WhyLinkingContent;
	Rules: Rules[];
	TermsAndCondition: TermsAndCondition;
}
