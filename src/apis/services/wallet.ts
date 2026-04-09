import { endpoints } from '../../configs/endpoints';
import { Platform } from 'react-native';
import { useApiMutation, useApiQuery } from '../network';
import { queryKeys } from '../queryKeys';
import {
	AddVoucherPayload,
	AddVoucherResponse,
	WalletBalnceResponse,
	WalletTransaction,
} from '../types/wallet';

export const useAddWalletVouterMutation = () => {
	return useApiMutation<AddVoucherResponse, AddVoucherPayload>({
		apiConfig: {
			method: 'POST',
			url: endpoints.wallet.scanVoucher,
		},
	});
};

export const useWalletTransactionQuery = (queryParams: {
	type: string;
	count: number;
	startIndex: number;
}) => {
	const { type, count, startIndex } = queryParams;
	return useApiQuery<WalletTransaction[]>({
		key: [queryKeys.walletTransactions, type, startIndex, count],
		apiConfig: {
			method: 'GET',
			url: endpoints.wallet.transactions,
			params: queryParams,
		},
	});
};

export const useWalletBalanceQuery = () => {
	return useApiQuery<WalletBalnceResponse>({
		key: [queryKeys.walletBalance],
		apiConfig: {
			method: 'GET',
			url: endpoints.wallet.balance,
		},
		queryConfig: {
			enabled: Platform.OS !== 'web', //TODO needs to be removed once balance api started working (Getting CORS error)
		},
	});
};
