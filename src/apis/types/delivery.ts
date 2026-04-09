export interface checkCoverageRequest {
	cityName: string;
	location: Location;
	orderType: string;
	deviceType?: string;
}

export interface CheckCoverageResponse {
	servicable: boolean;
}
export interface Location {
	latitude?: number;
	longitude?: number;
}

export interface AvilableSlotResponse {
	days: DayItem[];
	pickupLocationCode: string;
}

export interface DayItem {
	date: number;
	display_date: string;
	display_day_small: string;
	display_day_big: string;
	display_date_small: string;
	disabled: boolean;
	slots: SlotItem[];
}

export interface SlotItem {
	slot: string;
	display_slot: string;
}

export interface OrderDetailsResponse {
	requestedMsisdn: string;
	deliveryDate: string;
	deliveryMonth: string;
	deliveryYear: string;
	deliverySlot: string;
	address: string;
	latitude: string;
	longitude: string;
	orderId: string;
	formattedDate: string;
	packageDetails: {
		id: number;
		sku: string;
		name: string;
		price: number;
		vat_amount: number;
		total_price: number;
		vat_percent: number;
		package_info: {
			validity: {
				value: string;
				unit: string;
				applicable_for: string;
			};
		};
	};
	vatPercent: number;
	payBeforeActivation: boolean;
}

export interface ScheduleShipmentResponse {
	paymentRedirect: boolean;
	requestedMsisdn: string;
	deliveryDate: string;
	deliveryMonth: string;
	deliveryYear: string;
	deliverySlot: string;
	address: string;
	latitude: string;
	longitude: string;
	orderId: string;
	formattedDate: string;
	packageDetails: PackageDetails;
	vatPercent: number;
	payBeforeActivation: boolean;
}

export interface PackageDetails {
	id: number;
	sku: string;
	name: string;
	price: number;
	vat_amount: number;
	total_price: number;
	vat_percent: number;
	package_info: PackageInfo;
}

export interface PackageInfo {
	validity: Validity;
}

export interface Validity {
	value: string;
	unit: string;
	applicable_for: string;
}
export interface ScheduleShipmentRequest {
	cityName: string;
	sublocality_level_1?: string;
	locality?: string;
	route?: string;
	postal_code?: string;
	otoServiceType: string;
	address: Address;
	selectedSlot: SelectedSlot;
	orderType: string;
	deliveryContactNumber: string;
	country_code: string;
}

export interface Address {
	location: Location;
	text: string;
	remarks: string;
	shortAddressCode: string;
}

export interface SelectedSlot {
	date?: number;
	slot?: string;
	display_slot?: string;
}

export interface DeliveryDetailsResponse {
	name: string;
	phoneNo: string;
	idType: string;
	nationality: string;
	idValue: string;
	enteredEmail: string;
	passport_no: string;
	isEmailUpdateRequired: boolean;
}

export type RescheduleSlotPayload = {
	otoServiceType: string;
	selectedSlot: SelectedSlot;
	cityName?: string;
	locality?: string;
	route?: string;
	postal_code?: string;
	street_number?: string;
	postal_code_suffix?: string;
	delivery_details_id: string;
	address?: Address;
	orderType: string;
	deliveryContactNumber?: string;
	country_code?: string;
	sublocality_level_1?: string;
};
