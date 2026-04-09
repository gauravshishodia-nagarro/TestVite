import { endpoints } from '../../configs/endpoints';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { ORDER_TYPE } from '../../types';
import {
	getDateComponentsFromTimestamp,
	getDateFromTimestamp,
} from '../../utils/formatter';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	AvilableSlotResponse,
	CheckCoverageResponse,
	DeliveryDetailsResponse,
	OrderDetailsResponse,
	RescheduleSlotPayload,
	ScheduleShipmentRequest,
	ScheduleShipmentResponse,
	checkCoverageRequest,
} from '../types/delivery';

export const useCheckCoverage = () => {
	return useApiMutation<CheckCoverageResponse, checkCoverageRequest>({
		apiConfig: {
			method: 'POST',
			url: endpoints.delivery.checkCoverage,
		},
	});
};

export const useAvilableSlots = (queryParams?: Record<string, string>) => {
	const accessToken = useUserPreferenceStore.getState().accessToken;
	return useApiQuery<AvilableSlotResponse>({
		key: [queryKeys.availableSlots, queryParams],
		apiConfig: {
			method: 'GET',
			url: accessToken
				? endpoints.delivery.avilableSlots
				: endpoints.delivery.avialableSlotsGuest,
			params: queryParams,
		},
		queryConfig: {
			enabled: false,
			select: (data) => {
				console.log('slots', parseAvilableSlot(data));
				return parseAvilableSlot(data);
			},
		},
	});
};

const parseAvilableSlot = (
	availableSlots: AvilableSlotResponse,
): AvilableSlotResponse => {
	return {
		...availableSlots,
		days: availableSlots.days.map((day) => {
			const dateComponents = getDateComponentsFromTimestamp(day.date);
			return {
				...day,
				display_date: dateComponents.dateText,
				display_day_small: dateComponents.dayTextSmall,
				display_day_big: dateComponents.dayText,
				display_date_small: dateComponents.dateTextSmall,
				slots: day.slots.map((slot) => ({
					...slot,
				})),
			};
		}),
	};
};

export const useGetOrderDetailsQuery = () => {
	const { childUserId } = userJourneyStore.getState();

	return useApiQuery<OrderDetailsResponse>({
		key: [queryKeys.availableSlots],
		apiConfig: {
			method: 'GET',
			url: endpoints.delivery.orderDetails,
			headers: {
				...(childUserId && { 'child-user-id': childUserId }),
			},
		},
	});
};

export const useScheduleShipment = () => {
	const { childUserId } = userJourneyStore.getState();
	return useApiMutation<ScheduleShipmentResponse, ScheduleShipmentRequest>({
		apiConfig: {
			method: 'POST',
			url: endpoints.delivery.scheduleShipment,
			headers: {
				...(childUserId && { 'child-user-id': childUserId }),
				'merge-api': '2',
			},
		},
	});
};

export const useGetDeliveryDetailQuery = (
	orderType: ORDER_TYPE | undefined,
) => {
	return useApiQuery<DeliveryDetailsResponse>({
		key: [queryKeys.deliveryDetails],
		apiConfig: {
			method: 'GET',
			url: endpoints.delivery.deliveryDetails(orderType ?? ''),
		},
		queryConfig: {
			enabled: false,
		},
	});
};

export const useUpdateSlotMutation = () => {
	const queryClient = useQueryClient();

	return useApiMutation<any, RescheduleSlotPayload>({
		apiConfig: {
			method: 'PUT',
			url: endpoints.delivery.updateSlot,
		},
		mutationConfig: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: [queryKeys.shipmentStatus],
				});
				queryClient.invalidateQueries({
					queryKey: [queryKeys.myOrders],
				});
			},
		},
	});
};

export const useUpdateDeliverySlotDeviceOrderMutation = () => {
	return useApiMutation<any, { orderId: string; slot: number }>({
		apiConfig: {
			method: 'POST',
			url: endpoints.delivery.updateDeliverySlotDeviceOrder,
		},
	});
};

export const useGetShortAddressQuery = (
	latitude: string,
	longitude: string,
) => {
	return useApiQuery<OrderDetailsResponse>({
		key: [queryKeys.shortAddress],
		apiConfig: {
			method: 'GET',
			url: endpoints.delivery.shortAddress(latitude, longitude),
		},
	});
};
