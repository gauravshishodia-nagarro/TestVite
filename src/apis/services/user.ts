import { endpoints } from '../../configs/endpoints';
import { mutationKeys } from '../mutationKeys';
import { useApiMutation } from '../network';
import {
	AccountPayload,
	AccountResponse,
	RegisterPayload,
	RegisterResponse,
	UserProfilePayload,
	UserProfileResponse,
	VerifyOtpPayload,
	VerifyOtpResponse,
} from '../types/user';

export const useRegister = () => {
	return useApiMutation<RegisterResponse, RegisterPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.bffService.user.register,
		},
		mutationConfig: {
			mutationKey: [mutationKeys.register],
		},
	});
};

export const useVerifyOTP = () => {
	return useApiMutation<
		VerifyOtpResponse,
		VerifyOtpPayload & { userId: string; skipDeviceStatusCheck?: boolean }
	>({
		apiConfig: ({ userId }: any) => ({
			method: 'POST',
			url: endpoints.user.verifyOTP(userId), //`${endpoints.user.verifyOTP(userId)}?skipDeviceCheck=${skipDeviceStatusCheck}`, // dynamic URL
		}),
		mutationConfig: {
			mutationKey: [mutationKeys.verifyOTP],
		},
	});
};

export const useAccounts = () => {
	return useApiMutation<AccountResponse[], AccountPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.guestAccount,
		},
		mutationConfig: {
			mutationKey: [mutationKeys.accounts],
		},
	});
};

export const useProfile = () => {
	return useApiMutation<UserProfileResponse, UserProfilePayload>({
		apiConfig: ({ userId }: any) => ({
			method: 'GET',
			url: endpoints.user.profile(userId),
		}),
		mutationConfig: {
			mutationKey: [mutationKeys.userProfile],
		},
	});
};
