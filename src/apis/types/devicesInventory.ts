export type ItemStockCount = {
	stock_count?: number;
	stock_hold_count?: number;
};

export interface DeviceOrderRequest {
	sku: string;
	userInfo: UserInfo;
	deliveryInfo: DeliveryInfo;
	paymentOption?: string;
}

export interface UserInfo {
	name: string;
	phoneNo: string;
}

export interface DeliveryInfo {
	pickupLocationCode: string;
	cityName: string;
	sublocality_level_1: string;
	locality: string;
	route: string;
	postal_code: string;
	street_number: string;
	otoServiceType: string;
	address: Address;
	selectedSlot: SelectedSlot;
	orderType: string;
	deviceType: string;
	deliveryContactNumber: string;
	country_code: string;
}

export interface Address {
	location: Location;
	text?: string;
	remarks: string;
	shortAddressCode: string;
}

export interface Location {
	latitude?: number;
	longitude?: number;
}

export interface SelectedSlot {
	date?: number;
}

export interface DeviceOrderResponse {
	orderId: string;
}

export interface ProductContractResponse {
	ar: ProductContractContent;
	en: ProductContractContent;
}
export interface ProductContractContent {
	heading: string;
	content: string;
}

export interface FreeStockCountPayload {
	status: string;
}
