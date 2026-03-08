import {
  MSISDN_TRANSITION_TYPE,
  ONBOARDING_JOURNEY_TYPES,
  SubscriptionType,
} from "../../types/index";
import { PackageType } from "./store";

type DeliveryDetails = {
  address?: string;
  time?: string;
};

export type SimOrderPayload = Partial<{
  orderType: ONBOARDING_JOURNEY_TYPES;
  msisdn_transition_type: MSISDN_TRANSITION_TYPE | string;
  package: {
    sku: string;
  };
  selectedNumber: {
    requested_msisdn: string;
    requested_msisdn_id: string;
  };
  transferOperatorNumber?: {
    entered_msisdn: string;
    operator_id: string;
  };
  customer_info: {
    name: string;
    idType: number;
    idValue: string;
    nationality: number;
    phoneNo: string;
  };
  delivery: {
    delivery_phone_no: string;
    country_code: string;
  };
  simNumber: string;
  subscription_type: SubscriptionType;
  deliveryId: string;
  newSimType: ONBOARDING_JOURNEY_TYPES;
  performEligibiltyCheck: boolean;
  isGuestPortIn: boolean;
  nafathId: string;
}>;

export type SimOrderResponse = {
  cartId: string;
  orderId: string;
  packageName: string;
  price: string;
};

export interface CountryItem {
  id?: number;
  cournty_code?: number;
  country_en?: string;
  country_ar?: string;
  dial_code?: string;
  alpha_two_code?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
export type SimOrderCartResponse = {
  cartId: string;
  orderId: string;
  packageName: string;
  price: string;
  orderDetails: OrderDetails;
  installmentDetails: {
    responseCode: number;
    message: string;
    data: Record<string, unknown>;
  };
};

type PromoCode = {
  isApplied: boolean;
  errorMessage?: string;
};

export interface OrderDetails {
  orderId: string;
  country?: string;
  orderType: string;
  email?: string;
  is_email_verified: boolean;
  items: {
    item_id: number;
    sku: string;
    qty: number;
    name: string;
    price: number;
    product_type: string;
    quote_id: string;
    product_option: {
      extension_attributes: {
        custom_options: {
          option_id: string;
          option_value?: string;
        }[];
        loyalty_discount: {
          discount: number;
          original_price: string;
        };
      };
    };
    title: string;
    subtitle?: string;
    validty?: string;
    validtyUnit?: string;
    expiry?: string;
  }[];
  deliveryDetails?: DeliveryDetails;
  processAdvancePayment: boolean;
  itemExpiryOn?: string;
  installment: boolean;
  priceBreakdown: {
    price: string;
    vat_amount: number;
    discount_amount: number;
    total: number;
    tax_percentage: number;
  };
  promoCode: PromoCode;
  paymentLink?: string;
  disableAutoRenew: boolean;
  mokafaaEligible: boolean;
  multiplyingFactorMokafaa: number;
  enablePaymentOTP: boolean;
  name?: string;
}

export type SimOrderPackageInfoPayload = {
  package_sku: string;
  orderType: string;
  subscription_type: SubscriptionType;
};

export interface DeliveryDetailResponse {
  responseCode: number;
  eligible: boolean;
  paymentUrl: string;
  blacklisted: boolean;
  migration: Migration;
}

export interface Migration {
  belongsToZain: boolean;
  voiceLine: boolean;
  prepaid: boolean;
}
export interface PackageCartPayload {
  package_sku: string;
  signature?: string; // need to check if it required and how can we get this
  processAdvancePayment?: boolean;
}

export interface PackageCartResponse {
  packageDetails: PackageType;
  paymentRedirect: boolean;
  cartId: string;
  orderId: string;
  paymentLink: string;
  mokafaaEligible: boolean;
  multiplyingFactorMokafaa: number;
  price: string;
  priceWithTax: string;
  package_sku: string;
  packageName: string;
  numberOfApps: string;
  packageApps: any[];
  skipZeroApp: boolean;
  isNewPackage: boolean;
}

interface Contarct {
  isContractAgreed: boolean;
}
export interface AddressAndContractPayload {
  address: Address;
  contarct: Contarct;
}
export interface AddressAndContractReponse {
  address: Address;
  cities: CityItem[];
  contract: Contract;
  skipZeroApp: boolean;
  isELMEnabled: boolean;
}

export interface Address {
  buildingNumber: string;
  streetName: string;
  neighborhood: string;
  city: number | string;
  zipCode: string;
  additionalNumber: string;
}

export interface CityItem {
  idType: number;
  value: string;
}

export interface Contract {
  data: Data;
  isContractAgreed: boolean;
  contractAgreementDate: any;
}

export interface Data {
  en: ContractDetail;
  ar: ContractDetail;
}

export interface ContractDetail {
  userData: UserData;
  serviceInfo: ServiceInfo;
  articles: Article[];
  declaration: string;
}

export interface UserData {
  fullname: string;
  nationalityPdf: string;
  nationality: string;
  idTypePdf: string;
  idType: string;
  idNumber: string;
  passportNumber: string;
  borderId: string;
  contactNumber: string;
  simatiTcn: string;
  simatiTcnDT: string;
}

export interface ServiceInfo {
  zainNumber: string;
  lineType: string;
  package: string;
  simNumber: string;
}

export interface Article {
  title: string;
  data: any[];
}

export interface ESimDetailResponse {
  sm_dp_address: any;
  ac: string;
  activation_code: any;
  imsi: string;
  iccid: string;
  pin1: string;
  puk1: string;
  pin2: string;
  puk2: string;
  imageURl: string;
  iphone_image_1: string;
  iphone_image_2: string;
}
export interface EnteredNumberPayload {
  entered_msisdn: string;
  operator_selected: string;
  nationalId: string;
}
export interface VerifyEnteredNumberPayload {
  auth_code: string;
  entered_msisdn: string;
}
export interface VerifyEnteredNumberResponse {
  isVerified: boolean;
}

export interface CancelPortINPayload {
  simOrderId: string;
}

export interface CancelPortInResponse {
  isEligibleForRefund: boolean;
}

export interface CancelPortINPayload {
  simOrderId: string;
}

export interface SIMOrderMNPStartRequest {
  simNumber: string;
}

export interface SIMOrderMNPStartResponse {
  state: string;
  msisdn: string;
  subscription_type: string;
  userMultilineTokens: any;
}

export interface ActivationStatusResponse {
  id: string;
  user_id: string;
  status: string;
  order_type: string;
  requested_msisdn: any;
  msisdn_id: string;
  msisdn_request_time: string;
  msisdn_transition_type: string;
  msisdn_transition_status: string;
  entered_msisdn: string;
  operator: string;
  package_sku: string;
  country_code: string;
  user_delivery_phone_no: string;
  user_delivery_name: string;
  building_number: string;
  street_name: string;
  neighborhood: string;
  city: string;
  delivery_city: any;
  zip_code: string;
  additional_number: string;
  is_contract_agreed: boolean;
  contract_agreement_date: string;
  personal_id_type: string;
  personal_id_number: string;
  passport_no: any;
  border_id: any;
  nationality: string;
  delivery_scheduled_time: any;
  user_delivery_details_id: any;
  iam_token: any;
  token_source: any;
  delivered_at: any;
  sim_number: string;
  show_status_dismissed_at: any;
  notification_sent_at: any;
  workflow_process_id: any;
  mnp_workflow_process_id: string;
  chosen_apps: string;
  contract_url: any;
  eligibility_response: string;
  transaction_id: string;
  transaction_type: string;
  transaction_status: string;
  payment_done_at_for_first_package: string;
  merchant_reference: string;
  discount_percent: string;
  created_at: string;
  modified_at: string;
  subscription_type: string;
  auth_code: string;
  otp_status: number;
  otp_sent_at: string;
  entered_email: any;
  sps_failure: boolean;
  vas_failure: boolean;
  eligibilty_error: any;
  failure_type: any;
  delivery_id: string;
  activation_attempts: number;
  technical_error_notification_sent: any;
  technical_error_occured_at: any;
  user_matrix_id: any;
  activation_notification_sent: any;
  activation_notification_sent_time: any;
  first_package: string;
  first_package_status: string;
  first_package_transaction_id: any;
  reason: any;
  reactivated_order: boolean;
  msisdn_existing_status: any;
  cancellation_reason_id: any;
  semati_cancel_mobile: any;
  re_order_count: number;
  re_order_reasons: any;
  show_delivery_pop_up: boolean;
  activation_try_count: number;
  pay_before_activation: boolean;
  identity_technical_error_count: number;
  identity_business_error_count: number;
  payment_done_at: string;
  bundle_order: boolean;
  npr_retry_count: number;
  migration_timer: number;
  failureType: any;
}

export interface MySubscriptionDetailResponse {
  autorenew: boolean;
  packageExpired: boolean;

  isActivateByPassport: boolean;
}

// add on details
export interface AddOnDetail {
  id: string;
  sku: string;
  name: string;
  status: string;
  inventory: string;
  media_url: string;
  image: string;
  gift_details: string;
  category_name: string;
  quantity: number;
  is_in_stock: boolean;
  small_image: string;
  thumbnail: string;
  description: string;
  short_description: string;
  product_time_period: string;
  price: string;
  price_tax: string;
  product_tax_amount: string;
  voucher_icon: string;
  addon_multiplier: string;
  matrix_product_id: string;
  matrix_product_amount: string;
  package_info: PackageInfo;
  yaqoot_product_type: string;
  vatPercent: number;
  sortOrder: string;
}

export interface PackageInfo {
  validity: {
    days: string;
    applicable_for: string;
  };
  internet: {
    roaming: {
      included: null | any;
      social: null | any;
    };
    non_roaming: {
      included: {
        data: string;
        unit: string | null;
        description: string | null;
      } | null;
      social: null | any;
    };
    auto_renewal_data: string;
  };
  talktime: {
    roaming: TalktimeDetails;
    non_roaming: TalktimeDetails;
  };
  sms: {
    roaming: TalktimeDetails;
    non_roaming: TalktimeDetails;
  };
  telco_meta_data: any[];
}

export interface TalktimeDetails {
  local: any | null;
  intl: any | null;
}

// roaming International countries
export interface International {
  id: string;
  country_name: string;
  country_name_ar: string;
  country_flag: string;
  country_name_en: string;
}
export interface RoamingCountry extends International {
  operators: Operator[];
}

export interface Operator {
  data_bundle_allowed: boolean;
  operator_name: string;
  tap_codes: string;
  country_id: string;
  id: string;
}

export interface RoamingCountriesResponse {
  roamingCountries: RoamingCountry[];
  international: International[];
}

// no of apps
export interface NumberOfAppsAllowedResponse {
  noOfApps: number;
  maximum_allowed_high_usage_app: number;
  maximum_allowed_medium_usage_app: number;
  maximum_allowed_low_usage_app: number;
}

// update zero rated app selection
export type UpdateZeroRatedAppRequest = {
  appArray: string[];
  replaceCurrentCycle: boolean;
};
export interface ChangeAppPayload {
  oldApp: string;
  newApp: string;
  existingApps: string[];
  replaceCurrentCycle: boolean;
}

export interface RequestedAppResponse {
  oldApp: string;
  requestedApp: string;
}

export interface UserAppRequest {
  phoneNo: string;
  firstTimeSimActivation: boolean;
}
export interface AddOnCartReqest {
  sku: string;
  quantity: number;
  appArray: string[];
  signature?: string;
}
export interface AddOnCartResponse {
  cartId: string;
  orderId: string;
  mokafaaEligible: boolean;
  multiplyingFactorMokafaa: number;
}

export interface AppSubscriptionResponse {
  subscriptions: Subscription[];
  expiryDuration: string;
}

export interface Subscription {
  msisdn: string;
  name: string;
  type: string;
  subscription_product_id: string;
  price: string;
  duration: string;
  expiry_date: string;
  cancel_date?: string;
  is_auto_renew: boolean;
  sku: string;
  icon_url: string;
  matrix_product_id: string;
  status: number;
  is_card_dismissed: boolean;
  app_subscription_id: string;
}
export interface CancelReasonItem {
  cancellation_reason_id: number;
  status: string;
  display_order: number;
  order_journey: string;
  cancellation_reason: string;
}
export interface CancelOrderRequest {
  raisedBy: string;
  reasonId: number;
  reason: string;
  simOrderId?: string;
  simReplacementOrderId?: string;
  userId?: string;
}

export interface MultilineexpiredPackageResponse {
  username: string;
  email: string;
  is_email_verified: boolean;
  expiredPackages: ExpiredPackage[];
  paymentLink: string;
}

export interface ExpiredPackage {
  lineId: string;
  msisdn: string;
  packageSku: string;
  simType: string;
  lastPackageSku: string;
  packageDetail: PackagePriceDetail;
  lastPackageDetail: PackagePriceDetail;
  firstPackageStatus: string;
  incentivePackageDetails: PackageType;
}

export interface PackagePriceDetail {
  name: string;
  priceWithOutTax: string;
  tax: string;
  priceWithTax: string;
}

export interface MultilineCreateCartPayload {
  lineId: string;
  packageSku: string;
}

export type MultilineCreateCartResponse = {
  orderId: string;
  cartId: string;
  lineId: string;
  packageSku: string;
  disableAutoRenew: boolean;
  subtotal: string;
  cartTotalWithTax: string;
  cartTotal: number;
  discountAmount: string;
  taxAmount: string;
  taxPercent: number;
  promoCode: PromoCode;
  packageDetails: PackageType;
  deliveryDetails: DeliveryDetails;
  mokafaaEligible: boolean;
  multiplyingFactorMokafaa: number;
};

export interface MultilineGroupOrderCreatePayload {
  lineId: string;
  orderId: string;
  groupOrderId: string | null;
}

export interface MultilineGroupOrderCreateResponse {
  groupOrderId: string;
}
