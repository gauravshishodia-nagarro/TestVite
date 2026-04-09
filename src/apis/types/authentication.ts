import { EmailItem } from './user';

export interface LoginPayload {
	gcmId: string;
	phoneType: string;
	language: string;
	phoneNo?: string;
	email?: string;
	isEmailLogin?: boolean;
	id?: string;
}

export interface LoginResponse {
	auth: boolean;
	initialTimeInSecond: number;
	userId: string;
}

export interface VerifyLoginPayload {
	otp: string;
	deviceData?: DeviceDataPayload;
	email?: string;
	id?: string;
}

export interface DeviceDataPayload {
	deviceId: string;
	location: string;
	deviceName: string;
	gcmId: string;
}

export interface RenseLoginOTPPayload {
	deviceAuthorizationOtp: boolean;
	phoneNo?: string;
	email?: string;
	id?: string;
}

export interface UserIsTelcoPayload {
	phoneNo?: string;
}

export interface UserIsTelcoResponse {
	isTelcoUser: boolean;
}

export interface UserTokenPayload {
	ids: string[];
	gcmId: string;
	phoneType: string;
	language: string;
}

export interface SendShipmentOTPPayload {
	phone_no?: string;
	user_id: string;
}

export interface SendShipmentOTPResponse {
	request_id: string;
	initialTimeInSecond: number;
}

export interface VerifyShipmentPayload {
	otp: string;
	phone_no?: string;
	request_id?: string;
}

export interface VerifyEmailPayload {
	email: string;
	selectedEmailByNationalId: EmailItem | null;
	skipSendingOTP?: boolean;
	isMaskedEmail?: boolean;
	verificationCode?: string;
}

export interface VerifyEmailResponse {
	OTPInitialTimeInSecond: number;
	initialTimeInSecond: number;
}

export interface ValidateTawakkalnaTokenPayload {
	twkToken: string;
	full_name: string;
	mobile_number: string;
	email: string;
	language: string;
  }
  
  export interface ValidateTawakkalnaTokenResponse {
	token: string;
  }