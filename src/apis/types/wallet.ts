export interface AddVoucherPayload {
	voucher_code: string;
	msisdn: string;
}

export interface AddVoucherResponse {
	message: string;
	amount: number;
	balance: number;
	txn_id: string;
}

export interface WalletBalnceResponse {
	balance: Balance;
}

export interface Balance {
	balance: number;
	voucherAdded: boolean;
}

export interface WalletTransactionResponse {
	total: number;
	startIndex: number;
	count: number;
	type: string;
	data: WalletTransaction[];
}

export interface WalletTransaction {
	id: string;
	transaction_id: string;
	reference_id: string;
	type: string;
	amount: number;
	tax_amount: any;
	tax_percent: any;
	credit_channel: string;
	initiated_by: string;
	is_refund: boolean;
	refund_transaction_id: any;
	is_voucher_redemption: boolean;
	created_at: string;
	updated_at: string;
	title: string;
	subtitle: string;
}
