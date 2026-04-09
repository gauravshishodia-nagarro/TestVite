import { endpoints } from '../../configs/endpoints';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	ApplyCouponPayload,
	CountryResponse,
	MyOrderItem,
	ShipmentStatusResponse,
} from '../types/orderManagement';
import { OrderDetails } from '../types/telcoProvision';

export const useOrderCartQuery = (orderId: string) => {
	const { childToken } = userJourneyStore.getState();
	return useApiQuery<OrderDetails>({
		key: [queryKeys.orderCart],
		apiConfig: {
			method: 'GET',
			url: endpoints.orderManagement.orderCart(orderId),
			headers: {
				...(childToken && { Authorization: `Bearer ${childToken}` }),
			},
		},
		queryConfig: {
			enabled: false,
		},
	});
};

export const useApplyCouponMutation = () => {
	const { childToken } = userJourneyStore.getState();

	return useApiMutation<OrderDetails, ApplyCouponPayload>({
		apiConfig: ({ orderId }: any) => ({
			method: 'POST',
			url: endpoints.orderManagement.orderCart(orderId),
			headers: {
				...(childToken && { Authorization: `Bearer ${childToken}` }),
			},
		}),
	});
};

export const useDeleteCouponMutation = () => {
	const { childToken } = userJourneyStore.getState();

	return useApiMutation<OrderDetails, { orderId: string }>({
		apiConfig: ({ orderId }: any) => ({
			method: 'DELETE',
			url: endpoints.orderManagement.orderCart(orderId),
			headers: {
				...(childToken && { Authorization: `Bearer ${childToken}` }),
			},
		}),
	});
};

export const useAddOnSupportedCountriesQuery = (enabled: boolean) => {
	return useApiQuery<CountryResponse[]>({
		key: [queryKeys.orderCart],
		apiConfig: {
			method: 'GET',
			url: endpoints.orderManagement.country,
		},
		queryConfig: {
			enabled,
			gcTime: 60000,
			staleTime: 60000,
		},
	});
};

export const useMyOrdersQuery = () => {
	const userID = useUserPreferenceStore.getState().userId;
	return useApiQuery<MyOrderItem[]>({
		key: [queryKeys.myOrders],
		apiConfig: {
			method: 'GET',
			url: endpoints.bffService.order.orders(userID || ''),
		},
	});
};

export const useShipmentStatusQuery = (deliveryDetailId?: string) => {
	const userID = useUserPreferenceStore.getState().userId;
	return useApiQuery<ShipmentStatusResponse>({
		key: [queryKeys.shipmentStatus],
		apiConfig: {
			method: 'GET',
			url: endpoints.bffService.order.shipmentStatus(
				userID || '',
				deliveryDetailId || '',
			),
		},
		queryConfig: {
			enabled: !!deliveryDetailId,
		},
	});
};
