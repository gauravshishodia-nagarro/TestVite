import { packageType } from '../../components/packageDetails';
import constants from '../../configs/constants';
import { endpoints } from '../../configs/endpoints';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { API_REQ_STATE, ONBOARDING_JOURNEY_TYPES, SIM_TYPE } from '../../types';
import { getPackageSKU } from '../../utils/util';
import { useQueryClient } from '@tanstack/react-query';
import { mutationKeys } from '../mutationKeys';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import { PackagesResponse } from '../types/store';
import {
	ActivationStatusResponse,
	AddOnCartReqest,
	AddOnCartResponse,
	AddOnDetail,
	AddressAndContractPayload,
	AddressAndContractReponse,
	AppSubscriptionResponse,
	AutoRenewTogglePayload,
	AutoRenewToggleResponse,
	CancelOrderRequest,
	CancelPortINPayload,
	CancelPortInResponse,
	CancelReasonItem,
	ChangeAppPayload,
	CountryItem,
	DeliveryDetailResponse,
	ESimDetailResponse,
	EnteredNumberPayload,
	MultilineCreateCartPayload,
	MultilineCreateCartResponse,
	MultilineGroupOrderCreatePayload,
	MultilineGroupOrderCreateResponse,
	MultilineexpiredPackageResponse,
	MyMultilinesSubscriptionDetailsResponse,
	MySubscriptionDetailResponse,
	NumberOfAppsAllowedResponse,
	PackageCartPayload,
	PackageCartResponse,
	RequestedAppResponse,
	RoamingCountriesResponse,
	SIMOrderMNPStartRequest,
	SIMOrderMNPStartResponse,
	SimOrderCartResponse,
	SimOrderPackageInfoPayload,
	SimOrderPayload,
	SimOrderResponse,
	UpdateZeroRatedAppRequest,
	UserAppRequest,
	VerifyEnteredNumberPayload,
	VerifyEnteredNumberResponse,
} from '../types/telcoProvision';
import {
	AccountResponse,
	DeliveryDetailPayload,
	RegisterResponse,
} from '../types/user';
import { parsePackagesList } from './store';

export const usePostSimOrderRequest = () => {
	return useApiMutation<SimOrderResponse, SimOrderPayload>({
		apiConfig: (payload) => {
			const url = payload?.isGuestPortIn
				? endpoints.telcoProvision.simOrderGuest
				: endpoints.telcoProvision.simOrder;
			const {
				selectedPackage,
				selectedNumber,
				name,
				countryCode,
				idValue,
				phoneNumber,
				dialCode,
				nafathID,
				childUserId,
				simType,
				selectedOperator,
			} = userJourneyStore.getState();
			// define default values here
			const defaultData: SimOrderPayload = {
				package: {
					sku: getPackageSKU(),
					// simType === SIM_TYPE.PHYSICAL
					// 	? selectedPackage?.sku || ''
					// 	: selectedPackage?.esimPackage?.sku || '',
				},
				selectedNumber: {
					requested_msisdn: selectedNumber?.msisdn ?? '',
					requested_msisdn_id: selectedNumber?.id ?? '',
				},
				customer_info: {
					name: name,
					idType: countryCode === constants.saudiCountryCode ? 1 : 2,
					idValue: idValue ?? '',
					nationality: constants.saudiCountryCode,
					phoneNo: phoneNumber, // In old app for Telco user it's null but here we are sending value which entered on personal info screen
				},
				delivery: {
					delivery_phone_no: phoneNumber,
					country_code: dialCode,
				},
				subscription_type: packageType(selectedPackage),
				newSimType:
					simType === SIM_TYPE.ESIM
						? ONBOARDING_JOURNEY_TYPES.ESIM
						: ONBOARDING_JOURNEY_TYPES.NEW_SIM,
				performEligibiltyCheck: false,
				simNumber: '',
				deliveryId: '',
				transferOperatorNumber: {
					entered_msisdn: selectedOperator ? phoneNumber : '',
					operator_id: selectedOperator?.id || '',
				},
				...(nafathID && { nafathId: nafathID }),
			};

			const finalData = {
				...defaultData,
				...payload,
			};

			return {
				method: 'POST',
				url,
				data: finalData,
				headers: { ...(childUserId && { 'child-user-id': childUserId }) },
			};
		},
	});
};

export const useGetSimOrderCartQuery = () => {
	const { childToken } = userJourneyStore.getState();
	return useApiQuery<SimOrderCartResponse>({
		key: [queryKeys.simOrderCart],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.simOrderCart,
			headers: {
				'merge-api': '2',
				...(childToken && { Authorization: `Bearer ${childToken}` }),
			},
		},
	});
};

export const useCountryList = (enabled = true) => {
	return useApiQuery<CountryItem[]>({
		key: [queryKeys.countries],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.countyList,
		},
		queryConfig: {
			gcTime: Number.POSITIVE_INFINITY,
			staleTime: Number.POSITIVE_INFINITY,
			refetchOnMount: true,
			enabled,
		},
	});
};

export const useSimOrderPackageInfoMutation = () => {
	return useApiMutation<any, SimOrderPackageInfoPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.simOrderPackageInfo,
		},
		mutationConfig: {
			mutationKey: [mutationKeys.simOrderPackageInfo],
		},
	});
};

export const useDeliveryDetail = () => {
	return useApiMutation<
		DeliveryDetailResponse,
		DeliveryDetailPayload & { userId: string }
	>({
		apiConfig: ({ userId }: any) => ({
			method: 'POST',
			url: endpoints.telcoProvision.deliveryDetail(userId),
		}),
	});
};

export const usePackageCartMutation = () => {
	const { childToken } = userJourneyStore.getState();

	return useApiMutation<PackageCartResponse, PackageCartPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.packageCart,
			headers: {
				...(childToken && { Authorization: `Bearer ${childToken}` }),
			},
		},
		mutationConfig: {
			mutationKey: [mutationKeys.packageCart],
		},
	});
};

export const useGetAddressAndContract = () => {
	return useApiQuery<AddressAndContractReponse>({
		key: [queryKeys.addressAndContract],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.addressAndContract,
		},
	});
};

export const useAddressAndContractMutation = () => {
	return useApiMutation<any, AddressAndContractPayload>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.telcoProvision.addressAndContract,
		},
	});
};

export const useGetEsimDetailsQuery = () => {
	return useApiQuery<ESimDetailResponse>({
		key: [queryKeys.eSimDetails],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.eSimDetails,
		},
	});
};

export const useEnteredNumberMutation = () => {
	return useApiMutation<RegisterResponse, EnteredNumberPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.enteredNumber,
		},
	});
};

export const useEnteredNumberVerifyOTP = () => {
	return useApiMutation<
		VerifyEnteredNumberResponse,
		VerifyEnteredNumberPayload
	>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.verifyEnteredNumber,
		},
	});
};

export const useCancelPortInMutaion = () => {
	const queryClient = useQueryClient();

	return useApiMutation<CancelPortInResponse, CancelPortINPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.cancelPortIn,
		},
		mutationConfig: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [queryKeys.usermode] });
			},
		},
	});
};

export const useSimOrderMNPStartMutation = () => {
	return useApiMutation<SIMOrderMNPStartResponse, SIMOrderMNPStartRequest>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.telcoProvision.simOrderMNPStart,
		},
	});
};

export const useSIMOrderActivationStatusQuery = (enable: boolean) => {
	const userID = useUserPreferenceStore.getState().userId || '';
	const queryClient = useQueryClient();
	return useApiQuery<ActivationStatusResponse>({
		key: [queryKeys.activationStatusCheck],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.simOrderActivationStatus(userID),
		},
		queryConfig: {
			enabled: enable,
			refetchInterval: (query) => {
				const status = query?.state?.data?.status;

				// stop polling only when COMPLETED
				if (
					status === API_REQ_STATE.COMPLETE ||
					status === API_REQ_STATE.ACTIVATED ||
					status === API_REQ_STATE.ROLLBACK ||
					query?.state?.status === 'error'
				) {
					queryClient.invalidateQueries({ queryKey: [queryKeys.usermode] });
					return false;
				}

				// continue polling every 10s for REQUESTED, REJECTED, etc.
				return 10000;
			},
		},
	});
};

export const useSimOrderPackageInfoQuery = (
	queryParams?: Record<string, string>,
) => {
	const isGuest = useUserPreferenceStore.getState().userType === 'GUEST';
	const url = isGuest
		? endpoints.telcoProvision.simOrderPackageInfoGuest
		: endpoints.telcoProvision.simOrderPackageInfo;
	return useApiQuery<PackagesResponse>({
		key: [queryKeys.simOrderPackageInfo],
		apiConfig: {
			method: 'GET',
			url: url,
			params: queryParams,
		},
		queryConfig: {
			select: (data) => {
				return {
					...data,
					packages: parsePackagesList(data.packages),
				};
			},
		},
	});
};

export const useMultilineAccountsQuery = (isMultilineUser: boolean) => {
	return useApiQuery<AccountResponse[]>({
		key: [queryKeys.multilineAccounts],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.accounts,
		},
		queryConfig: {
			enabled: isMultilineUser,
			gcTime: Number.POSITIVE_INFINITY,
			staleTime: Number.POSITIVE_INFINITY,
		},
	});
};

export const useSubscriptionDetailQuery = () => {
	const { userId } = useUserPreferenceStore.getState();

	return useApiQuery<MySubscriptionDetailResponse>({
		key: [queryKeys.subscriptionDetail],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.mySubsctiptiionDetail(userId ?? ''),
		},
	});
};

export const useAppSubscriptionQuery = () => {
	const { phoneNumber } = useUserPreferenceStore.getState();

	return useApiQuery<AppSubscriptionResponse>({
		key: [queryKeys.appSubscription],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.appSubscription(phoneNumber ?? ''),
		},
		queryConfig: {
			select: (data) => {
				if (!data?.subscriptions || data.subscriptions.length === 0) {
					data.subscriptions = [
						{
							msisdn: '531111251',
							name: 'Shahid Sports Monthly',
							type: 'Shahid Sports Monthly',
							subscription_product_id: '2001',
							price: '30.00',
							duration: '30',
							expiry_date: '2025-12-18T23:59:59.000Z',
							cancel_date: undefined,
							is_auto_renew: true,
							sku: 'SHAHID-SPORTS-MONTHLY',
							icon_url: '',
							matrix_product_id: '987654321',
							status: 1,
							is_card_dismissed: false,
							app_subscription_id: 'app-sub-12345',
						},
						{
							msisdn: '531111251',
							name: 'Shahid Entertainment Weekly',
							type: 'Shahid Entertainment Weekly',
							subscription_product_id: '2002',
							price: '10.00',
							duration: '7',
							expiry_date: '2025-11-25T23:59:59.000Z',
							cancel_date: '2025-11-20T13:15:00.000Z',
							is_auto_renew: false,
							sku: 'SHAHID-ENT-WEEKLY',
							icon_url: '',
							matrix_product_id: '987654322',
							status: 3,
							is_card_dismissed: false,
							app_subscription_id: 'app-sub-67890',
						},
					];
					data.expiryDuration = '30';
					return data;
				}

				return data;
			},
		},
	});
};

export const useAddOnDetailsQuery = (sku: string) => {
	const _sku = encodeURI(sku);
	return useApiQuery<AddOnDetail[]>({
		key: [queryKeys.addonDetails],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.telcoProvision.addonDetails}/${_sku}`,
		},
	});
};

export const useRoamingCountriesQuery = (enabled: boolean) => {
	return useApiQuery<RoamingCountriesResponse>({
		key: [queryKeys.roamingCountries],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.telcoProvision.roamingCountries}`,
		},
		queryConfig: {
			enabled,
			staleTime: 60000,
			gcTime: 60000,
		},
	});
};

export const useNoOfAppsAllowedQuery = () => {
	return useApiQuery<NumberOfAppsAllowedResponse>({
		key: [queryKeys.noOfAppsAllowed],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.telcoProvision.numberOfApps}`,
		},
	});
};

export const useChangeAppMutation = () => {
	const { userId } = useUserPreferenceStore.getState();

	return useApiMutation<any, ChangeAppPayload>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.telcoProvision.changeApp(userId || ''),
		},
	});
};

export const useUpdateZeroRatedAppMutation = () => {
	const { userId } = useUserPreferenceStore.getState();
	return useApiMutation<any, UpdateZeroRatedAppRequest>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.telcoProvision.updateApps(userId || ''),
		},
	});
};

export const useRequestedAppQuery = () => {
	const { userId } = useUserPreferenceStore.getState();

	return useApiQuery<RequestedAppResponse[]>({
		key: [queryKeys.requestedApps],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.telcoProvision.requestedApps(userId || '')}`,
		},
	});
};

export const useUserAppMutation = () => {
	return useApiMutation<string[], UserAppRequest>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.telcoProvision.userApps,
		},
	});
};

export const useAddOnDataQuery = (sku: string) => {
	const _sku = encodeURI(sku);
	return useApiQuery<AddOnDetail>({
		key: [queryKeys.addonDetails],
		apiConfig: {
			method: 'GET',
			url: `${endpoints.telcoProvision.addOnData}/${_sku}`,
		},
	});
};

export const useAddOnCartMutation = () => {
	return useApiMutation<AddOnCartResponse, AddOnCartReqest>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.addOnCart,
		},
	});
};

export const useCancelOrderReasonQuery = (
	orderType?: string,
	callOnMount = true,
) => {
	return useApiQuery<CancelReasonItem[]>({
		key: [queryKeys.cancelOrderReason],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.cancelOrderReasons(orderType || ''),
		},
		queryConfig: {
			enabled: !!orderType && callOnMount,
		},
	});
};

export const useCancelOrderMutation = (isSIMReplcement?: boolean) => {
	return useApiMutation<any, CancelOrderRequest>({
		apiConfig: {
			method: 'POST',
			url: isSIMReplcement
				? endpoints.telcoProvision.cancelReplacementOrder
				: endpoints.telcoProvision.cancelOrder,
		},
	});
};

export const useMultilineExpiredPackagesQuery = (
	sku: string,
	isMultiline: boolean,
) => {
	return useApiQuery<MultilineexpiredPackageResponse>({
		key: [queryKeys.multilineExpiredPackages],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.multilneExpiredPackages(sku),
		},
		queryConfig: {
			enabled: isMultiline,
		},
	});
};

export const useCreateMultilineRenewalCart = () => {
	return useApiMutation<
		MultilineCreateCartResponse,
		MultilineCreateCartPayload
	>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.multilineCreateCart,
		},
	});
};

export const useMultilineGroupCreateCart = () => {
	return useApiMutation<
		MultilineGroupOrderCreateResponse,
		MultilineGroupOrderCreatePayload[]
	>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.mulitilineGroupOrderCreate,
		},
	});
};

export const useMyMultilinesSubscriptionDetails = () => {
	const { userId } = useUserPreferenceStore.getState();

	return useApiQuery<MyMultilinesSubscriptionDetailsResponse[]>({
		key: [queryKeys.multilineExpiredPackages],
		apiConfig: {
			method: 'GET',
			url: endpoints.telcoProvision.myMultilinesSubscriptionDetails(
				userId || '',
			),
		},
	});
};

export const useToggleAutoRenewMutation = () => {
	const { userId } = useUserPreferenceStore.getState();
	return useApiMutation<AutoRenewToggleResponse, AutoRenewTogglePayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.telcoProvision.autoRenew(userId || ''),
		},
	});
};
