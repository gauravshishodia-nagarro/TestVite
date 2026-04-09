import { UserJourneyType } from '@/src/stores/userJourneyStore';
import { UserType } from '@/src/stores/userPreferencesStore';
import { SubscriptionType } from '@/src/types';
import { CardResponse } from './payment';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type EmptyIdentity = {};

export interface RegisterPayload {
	userType?: UserType;
	name: string;
	phoneNo: string;
	email: string;
	gcmId: string;
	phoneType: string;
	pass?: string;
	allowNotification: string;
	journey: UserJourneyType | string;
	selectedEmailByNationalId?: any;
	msisdnTransitionType?: string;
	language?: string;
	isBundleOrder?: boolean;
	performEligibilityCheck?: boolean;
	subscriptionType?: SubscriptionType | null;
	orderType?: string;
	identityDetails?: IdentityDetails | EmptyIdentity;
	isTelcoOfflineActivation?: boolean;
	newSimType?: string;
	countryCode?: string;
	nafathId?: string;
	phoneNoIsNewMSISDN?: boolean;
	isForeignInvestor?: boolean;
}

export type DeliveryDetailPayload = Partial<{
	name: string;
	phoneNo: string;
	idType: number;
	idValue: string;
	nationality: string;
	orderType: string;
	simNumber: string;
	cancelMnp: boolean;
	email: string;
	isMaskedEmail: boolean;
	selectedEmailByNationalId: any;
	journey: string;
	reactivatedOrder: boolean;
	isBundleOrder: boolean;
	performEligibiltyCheck: boolean;
	countryCode: string;
}>;

export interface IdentityDetails {
	idType: number;
	idValue: string;
	nationality: string;
}

export interface RegisterResponse {
	auth: boolean;
	initialTimeInSecond: number;
	userId: string;
	alreadyRegistered: boolean;
	alreadyTelcoUser: boolean;
	skipOTP: boolean;
	secureToken: string;
	token?: string;
	eligibilityStatus: EligibilityStatus;
	isRegistrationSkipOtp?: boolean;
}

export interface EligibilityStatus {
	idValue: string;
	responseCode: number;
	eligible: boolean;
}

type DeviceInfo = {
	deviceId: string;
	location: string;
	deviceName: string;
	gcmId: string;
};

export interface VerifyOtpPayload {
	otp?: string;
	deviceData?: DeviceInfo;
	phoneNo?: string;
	isSimJourney?: boolean;
	subscriptionType?: SubscriptionType | null;
	secureToken?: string;
}

export interface VerifyOtpResponse {
	communication_email: string;
	email: string | null;
	emailToVerify: string;
	isEmailVerified: boolean;
	loginStatus: string; // getting guest as
	name: string;
	phoneNo: string;
	token: string;
	userId: string;
	auth: boolean;
	deviceStatus: string;
	twoStepVerificationTimer: number;
}

export interface AccountPayload {
	email?: string;
	nationalIdOrIqama?: string;
}

export interface AccountResponse {
	id: string;
	msisdn: string;
	subscriberStatus: string;
	currentPackage?: string;
	subscriptionType: string;
	simType: string;
	package_sku?: string;
	catalogItemId?: number;
	sku?: string;
	package_color?: string;
	package_logo_image?: string;
	isEmailVerified?: boolean;
	emailToVerify?: string;
	email?: string;
}

export type ResendOTPResponse = {
	initialTimeInSecond: number;
};

export type EmailItem = {
	id?: string;
	email_id: string;
	is_verified?: boolean;
};

export type TelcoEmailsResponse = {
	data: EmailItem[];
};

export interface UserProfilePayload {
	userId: string;
}

export interface OverAllGiftData {
	sentGift: number;
	receivedGift: number;
	campaignState: string;
}

export interface UserProfileResponse {
	emailId: string;
	emailVerified: boolean;
	phoneNo: string;
	contactNo: string;
	createdAt: string;
	countryCode: string | null;
	name: string;
	created_by: string | null;
	parent_id: string | null;
	isPrimary: boolean;
	profilePic: string | null;
	allowNotification: number;
	memberSince: string;
	cards: CardResponse[];
	addCardUrl: string;
	gamificationData: any[];
	overAllGiftData: OverAllGiftData;
	defaultCardData: Partial<CardResponse>;
	is_apple_pay_enabled: boolean;
	showReferral: boolean;
	showDeleteAccount: boolean;
	userNationalId: string | null;
}
