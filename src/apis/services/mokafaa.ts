import { endpoints } from '../../configs/endpoints';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	MokafaaEnrollPayload,
	MokafaaEnrollResendPayload,
	MokafaaEnrollResponse,
	MokafaaEnrollVerifyPayload,
	MokafaaRulesResponse,
	MokafaaTermsResponse,
	RedeemPointPyload,
	RedeemPointResponse,
	SendReedeemOTPResponse,
	SendReedemOTPPayload,
} from '../types/mokafaa';

export const useGetMokafaaTerms = () => {
	return useApiQuery<MokafaaTermsResponse>({
		key: [queryKeys.mokafaaTerms],
		apiConfig: {
			method: 'GET',
			url: endpoints.mokafaa.terms,
		},
		queryConfig: {
			gcTime: 60 * 1000,
			staleTime: 60 * 1000,
		},
	});
};

export const useMokafaaWalletExistsQuery = (phoneNumber: string) => {
	return useApiQuery<any>({
		key: [queryKeys.mokafaaWalletExists],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.mokafaa.isWalletExists}/${phoneNumber}`,
		},
		queryConfig: {
			enabled: false,
		},
	});
};

export const useMokafaaEnrollMutation = () => {
	return useApiMutation<MokafaaEnrollResponse, MokafaaEnrollPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.mokafaa.enroll,
		},
	});
};

export const useMokafaaVerifyEnrollMutation = () => {
	return useApiMutation<any, MokafaaEnrollVerifyPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.mokafaa.verifyEnrollOTP,
		},
	});
};

export const useMokafaaResendEnrollMutation = () => {
	return useApiMutation<any, MokafaaEnrollResendPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.mokafaa.resendEnrollOTP,
		},
	});
};
export const useDefaultMobileNumberQuery = () => {
	return useApiQuery<any>({
		key: [queryKeys.mokafaaDefaultNumber],
		apiConfig: {
			method: 'GET',
			url: endpoints.mokafaa.defaultMobileNumber,
		},
	});
};

export const useSendReedemOTPMutation = () => {
	return useApiMutation<SendReedeemOTPResponse, SendReedemOTPPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.mokafaa.sendReddemOTP,
		},
	});
};

export const useReedemPointMutation = () => {
	return useApiMutation<RedeemPointResponse, RedeemPointPyload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.payment.redeemPoints,
		},
	});
};

export const useGetMokafaaRules = (params?: Record<string, string>) => {
	return useApiQuery<MokafaaRulesResponse>({
		key: [queryKeys.mokafaaRules],
		apiConfig: {
			method: 'GET',
			url: endpoints.bffService.mokafaa.rules,
			params,
		},
		queryConfig: {
			gcTime: 60 * 1000,
			staleTime: 60 * 1000,
		},
	});
};
