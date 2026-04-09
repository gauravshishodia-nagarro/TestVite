import { Status, UpdateType } from '@/src/components/orderStatusTimeline';

export type ApplyCouponPayload = { promoCode: string; orderId: string };

export type CountryResponse = {
	name: string;
	country_flag: string;
	displayName: string;
};

export interface MyOrderItem {
	id: string;
	user_id?: string;
	user_delivery_details_id?: string;
	subscription_type: string;
	created_at: string;
	first_package?: string;
	package_sku?: string;
	first_package_status?: string;
	first_package_transaction_id?: string;
	transaction_id?: string;
	msisdn_transition_type?: string;
	sim_type: string;
	status: string;
	pay_before_activation?: boolean;
	order_type: string;
	shipment_status: string;
	order_id?: string;
	price: string;
	items: OrderProductItem[];
	isActivated: boolean;
	allowReship: boolean;
	allowRefund: boolean;
	showRefundError: boolean;
	user_delivery_detail_id?: string;
	shipment_sub_status?: string;
	deliveryDate?: string;
	user_sim_replace_request_id?: string;
	user_sim_replace_request_user_id?: string;
	user_sim_replace_request_status?: string;
	shipmentId?: string;
	orderPlacedOn?: string;
}

export interface OrderProductItem {
	id?: string;
	user_id?: string;
	user_delivery_details_id?: string;
	subscription_type: string;
	created_at: string;
	first_package?: string;
	package_sku?: string;
	firstPackageName?: string;
	first_package_status?: string;
	first_package_transaction_id?: string;
	transaction_id?: string;
	msisdn_transition_type?: string;
	sim_type: string;
	status?: string;
	pay_before_activation?: boolean;
	order_type: string;
	shipment_status: string;
	order_id?: string;
	price: string;
	user_delivery_detail_id?: string;
	shipment_sub_status?: string;
	deliveryDate?: string;
	user_sim_replace_request_id?: string;
	user_sim_replace_request_user_id?: string;
	user_sim_replace_request_status?: string;
	device_sku?: string;
	bundleOrder?: boolean;
	quantity?: number;
	name?: string;
	parent_sku?: string;
	color?: DeviceVariant;
	capacity?: DeviceVariant;
	variant?: DeviceVariant;
	images?: string[];
	media_url?: string;
	small_image?: string;
	thumbnail?: string;
	short_description?: string;
	parent_name?: string;
}

export interface DeviceVariant {
	label: string;
	color_code: string[];
}

export interface ShipmentStatusResponse {
	paymentDetails: PaymentDetails;
	shipmentResponse: ShipmentResponse;
}

export interface PaymentDetails {
	totalPayableAmount: string;
	totalPrice: string;
	vatPercentage: any;
	billingMethod: BillingMethod;
}

export interface BillingMethod {
	maskedCardNumber: string;
	cardHolderName: string;
	card_type: string;
	type: string;
}

export interface ShipmentResponse {
	id: string;
	status: string;
	reorder: any;
	city: string;
	address: string;
	latitude: string;
	longitude: string;
	deliveryDate: string;
	selected_slot: string;
	selected_day: string;
	selected_month: string;
	selected_year: string;
	shipment_id: string;
	delivery_remarks: string;
	reschedulable: boolean;
	otoServiceType: string;
	shipmentTimeline: ShipmentTimeline[];
	dcStatus: string;
	note: string;
	orderType: string;
	statusIdentifier: string;
	message: string;
	yaqoot_order_id: string;
	reactivated_order: number;
}

export interface ShipmentTimeline {
	status: Status;
	completed: boolean;
	completedTime?: string;
	completedDate?: string;
	updateType?: UpdateType; // not any key present in response just added for code refrence
}
