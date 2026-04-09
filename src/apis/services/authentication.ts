import { endpoints } from '../../configs/endpoints';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { mutationKeys } from '../mutationKeys';
import { useApiQuery } from '../network';
import { useApiMutation } from '../network';
import { queryKeys } from '../queryKeys';
import { UserMultilineTokens } from '../types/activation';
import {
	LoginPayload,
	LoginResponse,
	RenseLoginOTPPayload,
	SendShipmentOTPPayload,
	SendShipmentOTPResponse,
	UserIsTelcoPayload,
	UserIsTelcoResponse,
	UserTokenPayload,
	VerifyEmailPayload,
	VerifyEmailResponse,
	VerifyLoginPayload,
	VerifyShipmentPayload,
	ValidateTawakkalnaTokenPayload,
	ValidateTawakkalnaTokenResponse
} from '../types/authentication';
import {
	EmailItem,
	ResendOTPResponse,
	TelcoEmailsResponse,
} from '../types/user';
import { VerifyOtpResponse } from '../types/user';

export const useLogin = () => {
	return useApiMutation<LoginResponse, LoginPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.login,
		},
		mutationConfig: {
			mutationKey: [mutationKeys.login],
		},
	});
};

export const useVerifyLogin = () => {
	return useApiMutation<VerifyOtpResponse, VerifyLoginPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.verfiyLogin,
		},
		mutationConfig: {
			mutationKey: [mutationKeys.verifyOTP],
		},
	});
};

export const useResendLoginOTP = () => {
	return useApiMutation<LoginResponse, RenseLoginOTPPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.resendLoginOTP,
		},
	});
};

export const useResendOtpQuery = (userId?: string) => {
	return useApiQuery<ResendOTPResponse>({
		key: [queryKeys.resendOTP],
		apiConfig: {
			method: 'GET',
			url: endpoints.authentication.resendOTP(userId ?? ''),
		},
		queryConfig: {
			enabled: false,
		},
	});
};

export const useUserIsTelco = () => {
	return useApiMutation<UserIsTelcoResponse, UserIsTelcoPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.userIsTelco,
		},
	});
};

export const useUserTokensMutation = () => {
	return useApiMutation<UserMultilineTokens, UserTokenPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.userTokens,
		},
	});
};

export const useShipmentSendOTPMutation = () => {
	return useApiMutation<SendShipmentOTPResponse, SendShipmentOTPPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.authentication.shipmentOTP,
		},
	});
};

export const useVerifyShipmentMutation = () => {
	return useApiMutation<any, VerifyShipmentPayload>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.authentication.verifyShimpentOTP,
		},
	});
};

export const useTelcoEmails = () => {
	const { userType } = useUserPreferenceStore.getState();
	return useApiQuery<EmailItem[]>({
		key: [queryKeys.telcoEmails],
		apiConfig: {
			method: 'GET',
			url: endpoints.authentication.telcoEmails,
		},
		queryConfig: {
			enabled: userType === 'TELCO',
		},
	});
};

export const useVerifyTWKToken = () => {
	return useApiMutation<ValidateTawakkalnaTokenResponse, ValidateTawakkalnaTokenPayload>({
	  apiConfig: ({ twkToken, ...body }: any) => ({
		method: 'POST',
		url: endpoints.tawakkalna.validateToken,
		headers: {
		  Authorization: `Bearer ${twkToken}`,
		},
		data: body,   // full_name, mobile_number, email, language
	  }),
	});
  };


