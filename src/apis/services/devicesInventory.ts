import { endpoints } from '../../configs/endpoints';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	DeviceOrderRequest,
	DeviceOrderResponse,
	FreeStockCountPayload,
	ItemStockCount,
	ProductContractResponse,
} from '../types/devicesInventory';

export const useItemStockQuery = (
	sku: string,
	params: { pickupLocationCode: string },
	isHoldCount?: boolean,
) => {
	return useApiQuery<ItemStockCount>({
		key: [queryKeys.itemStockCount],
		apiConfig: {
			method: 'GET',
			url: isHoldCount
				? endpoints.devicesInventory.itemStockHoldCount(sku)
				: endpoints.devicesInventory.itemStockCount(sku),
			params,
		},
		queryConfig: {
			enabled: false,
		},
	});
};

export const useDeviceOrderMutation = () => {
	return useApiMutation<DeviceOrderResponse, DeviceOrderRequest>({
		apiConfig: ({ sku }: any) => ({
			method: 'POST',
			url: endpoints.devicesInventory.deviceOrder(sku),
		}),
	});
};

export const useProductContractQuery = (sku?: string) => {
	return useApiQuery<ProductContractResponse>({
		key: [queryKeys.prodcutContract],
		apiConfig: {
			method: 'GET',
			url: endpoints.devicesInventory.productContract(sku || ''),
		},
		queryConfig: {
			enabled: !!sku,
		},
	});
};

export const useFreeDeviceStockMutation = (sku?: string) => {
	return useApiMutation<any, FreeStockCountPayload>({
		apiConfig: () => ({
			method: 'PUT',
			url: endpoints.devicesInventory.freeItemStockCount(sku || ''),
		}),
	});
};
