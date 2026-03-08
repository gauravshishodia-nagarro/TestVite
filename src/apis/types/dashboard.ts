import { SubscriptionType } from "../../types/index";

export type PackageInfo = {
  name: string;
  userStatus: string;
  sku: any;
  status: string;
  remainingDays: number;
  min: string;
  data: string;
  unlimitedApps: any[];
  renewalUrl: string;
  cardType: string;
  hasSubscribedForApps: boolean;
  numberOfApps: number;
  packageApps: any[];
  lastRenewalDate: string;
  allowSwitch: boolean;
  social: string;
  nationaDayData: string;
};

export interface PackageSwitch {
  allowSwitch: boolean;
  allowOld: boolean;
}
export type LastPackageDetail = {
  name: string;
  sku: string;
  id: number;
  expiryDate: string | null;
  catalogId: string;
  catlogItemId: string; // keeping backend spelling
  displayName: string;
  totalDays: string; // backend sends as string
  packageApps: any[]; // replace `any` with a proper type if known
  price: string; // backend sends as string
  price_tax: number;
};

export type UserMode = {
  mode: string;
  simStatus: any;
  packageInfo: PackageInfo;
  simType: string;
  simActivated: number;
  isTelcoUser: boolean;
  lastPackageDetails: LastPackageDetail;
  nationality: any;
  idValue: string;
  isDevice: boolean;
  packageSwitch: PackageSwitch;
  eligibleToRetryActivation: any;
  isActivateByPassport: boolean;
  passportNo: any;
  userMatrixSetUpdate: any;
  firstPackageName: string;
  firstPackageSku: string;
  firstPackageStatus: string;
  isDeactivationRequested: boolean;
  enableNewSimOrderJourneyUsingPassportNo: boolean;
  phoneNumberMandate: boolean;
  enablePassportOption: boolean;
};

export interface ActionData {
  emailToBeVerified?: string;
  id?: string;
  orderType?: string;
}
export interface Action {
  key: string;
  data?: ActionData;
}
export interface TopBanner {
  key: string;
}

export type UserMnpStatus = {
  failureType: string;
  simatiErrorCode: number;
};
export interface OrderJourney {
  status: string;
  orderType: string;
  msisdnTransitionType: string;
  msisdnTransitionStatus: string;
  failureType: any;
  msisdn: string;
  userMnpStatus: UserMnpStatus;
  transactionStatus: any;
  simOrderId: string;
  subscriptionType: string;
  deliveryId: any;
  simNumber: any;
  packageSku: string;
  eligibleToRetryActivation: any;
  alternate_phone_no: string;
  alternate_country_code: string;
  requested_msisdn: string;
  showDeliveryPopUp: boolean;
  simati_completed: boolean;
  payBeforeActivation: boolean;
  activationTryCount: number;
  allowRefund: boolean;
  payment_done_at_for_first_package: any;
  showRefundError: boolean;
}

export interface Mokafaa {
  eligiblePackages: string[];
  eligiblePackagesSKU: string[];
  multiplyingFactor: number;
  mokaffaWalletStatus: string;
  mokafaaWelcomePointsConfig: MokafaaWelcomePointsConfig;
  mokaffaLoyaltyConfig: MokaffaLoyaltyConfig;
}

export interface MokafaaWelcomePointsConfig {
  enabled: boolean;
  hideHomePageBannerForWelcomePoints: boolean;
}

export interface MokaffaLoyaltyConfig {
  enabled: boolean;
  hideMokafaaPointsSection: boolean;
  hideHomePageBanner: boolean;
}

export type UserModeResponse = {
  userMode: UserMode;
  actions: Action[];
  topBanner: TopBanner;
  orderJourney: OrderJourney;
  phoneNumber: string;
  subscriptionType?: SubscriptionType;
  mokafaa: Mokafaa;
  zainFraud: boolean;
  zainFraudDaysRemaining: number;
  userEmail?: string;
};
