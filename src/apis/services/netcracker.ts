import { endpoints } from '../../configs/endpoints';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	AvilableNumbersResponse,
	NumberItem,
	OperatorsType,
	UnlockNumberPaylod,
	UpdateOrderPayload,
} from '../types/netcracker';

export const useAvialbaleNumberQuery = (isOrderJourney: boolean) => {
	const accessToken = useUserPreferenceStore.getState().accessToken;
	return useApiQuery<AvilableNumbersResponse>({
		key: [queryKeys.avilableNumbers],
		apiConfig: {
			method: 'GET',
			url: accessToken
				? endpoints.netcracker.telcoAvialableNumber
				: endpoints.netcracker.guestAvilableNumber,
		},
		queryConfig: {
			enabled: isOrderJourney,
		},
		// queryConfig: {
		// 	select: (data) => {
		// 		if (!data?.numbers || data.numbers.length === 0) {
		// 			data.numbers = [
		// 				{
		// 					id: '9171786805013183725',
		// 					msisdn: '594255984',
		// 					selected: false,
		// 				},
		// 				{
		// 					id: '9173489883313502003',
		// 					msisdn: '593003856',
		// 					selected: false,
		// 				},
		// 				{
		// 					id: '9174102757013866167',
		// 					msisdn: '599802034',
		// 					selected: false,
		// 				},
		// 				{
		// 					id: '9174102758213866167',
		// 					msisdn: '599272518',
		// 					selected: false,
		// 				},
		// 			];
		// 			return data;
		// 		}

		// 		return data;
		// 	},
		// },
	});
};

export const useUnlockNumber = () => {
	return useApiMutation<any, UnlockNumberPaylod>({
		apiConfig: {
			method: 'POST',
			url: endpoints.netcracker.unlockNumber,
		},
	});
};

export const useUpdateOrder = () => {
	return useApiMutation<NumberItem, UpdateOrderPayload>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.netcracker.updateOrder,
		},
	});
};

export const useOperatorDictionaryQuery = (
	queryParams?: Record<string, string>,
) => {
	return useApiQuery<OperatorsType[]>({
		key: [queryKeys.operatorDictionary],
		apiConfig: {
			method: 'GET',
			url: endpoints.netcracker.operatorDictionary,
			params: queryParams,
		},
	});
};
