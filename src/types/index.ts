import { RefObject } from "react";
import type { AccessibilityRole, DimensionValue } from "react-native";
// import { Coordinates } from '../hooks/useCurrentLocation';

export type Path<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}.${Path<T[K], keyof T[K]>}` | K
    : K
  : never;

export type DeepKeys<T> = Path<T, keyof T>;

export const setAccessibilityProps = ({
  nativeID,
  accessibilityLabel,
  role = "none",
}: {
  nativeID?: string;
  accessibilityLabel?: string;
  role?: AccessibilityRole;
}) => ({
  accessibilityRole: role,
  accessibilityLabel: accessibilityLabel || nativeID,
  accessible: true,
  nativeID,
  testID: nativeID,
});

export enum SIM_TYPE {
  ESIM = "ESIM",
  PHYSICAL = "PHYISICAL_SIM",
}

// export type GoogleMapViewProps = {
// 	mapRef?: RefObject<any | null>;
// 	markerIcon?: string;
// 	tooltipLabel: string;
// 	tooltipTitle?: string;
// 	containerClassname?: string;
// 	mapHeight?: DimensionValue;
// 	mapWidth?: DimensionValue;
// 	resetToCurrentLocation?: boolean;
// 	updatedCoordinates?: (coordinates: Coordinates) => void;
// 	initialCoordinates?: Coordinates;
// 	followCenterWeb?: boolean;
// };

export type RenewMultilineOrderDetailsType = {
  cartTotalWithTax: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  vatPercent: number;
};
export type EarnedMokafaaPointType = {
  subTotal: number;
  discount: number;
  mokafaaEligible: boolean;
  multiplyingFactorMokafaa: number;
};

export const SUBSCRIPTION_TYPE = ["VOICE", "DATA"] as const;
export type SubscriptionType = (typeof SUBSCRIPTION_TYPE)[number];

export enum JourneyType {
  SWITCH_NUMBER = "SWITCH_NUMBER",
  NEW_NUMBER = "NEW_NUMBER",
  ACTIVATION = "ACTIVATION",
  REACTIVATION = "REACTIVATION",
  SIM_ORDER = "SIM_ORDER",
  ABSHER = "ABSHER",
  MOVE_ESIM_TO_ANOTHER_DEVICE = "MOVE_ESIM_TO_ANOTHER_DEVICE",
  CHANGE_TO_SIM = "CHANGE_TO_SIM",
  CHANGE_TO_ESIM = "CHANGE_TO_ESIM",
  SIM_REPLACEMENT_PASSPORT = "SIM_REPLACEMENT_PASSPORT",
  SIM_REPLACEMENT = "SIM_REPLACEMENT",
  MOVE_ESIM_TO_ANOTHER_DEVICE_PASSPORT = "MOVE_ESIM_TO_ANOTHER_DEVICE_PASSPORT",
  CHANGE_TO_SIM_PASSPORT = "CHANGE_TO_SIM_PASSPORT",
  CHANGE_TO_ESIM_PASSPORT = "CHANGE_TO_ESIM_PASSPORT",
  ORDER_PACKAGE = "ORDER_PACKAGE",
}

export enum MSISDN_TRANSITION_TYPE {
  NEW_NUMBER = "NEW_NUMBER",
  PORT_IN = "PORT_IN",
  ZAIN_TO_YAQOOT = "ZAIN_TO_YAQOOT",
  OWNERSHIP_TRANSFER = "OWNERSHIP_TRANSFER",
}
export enum ORDER_TYPE {
  SIM = "SIM",
  DEVICE = "DEVICE",
}

export enum ONBOARDING_JOURNEY_TYPES {
  NEW_SIM = "NEW_SIM",
  ESIM = "ESIM",
  OFFLINE_SIM = "OFFLINE_SIM",
  SIM_THROUGH_MRSOOL = "SIM_THROUGH_MRSOOL",
  DEVICE = "DEVICE",
}
export enum OTO_SERVICE_TYPE {
  BULLET = "bullet",
  COURIER = "courier",
}

export enum HOME_CARDS_ACTION {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  COMPLETE_SIM_ORDER = "COMPLETE_SIM_ORDER",
  SIM_DELIVERY_IN_PROGRESS = "SIM_DELIVERY_IN_PROGRESS",
  ACTIVATE_SIM = "ACTIVATE_SIM",
  ERR_ACTIVATION = "ERR_ACTIVATION",
  ACTIVATE_MNP_SIM = "ACTIVATE_MNP_SIM",
  START_Z2Y_MIGRATION = "START_Z2Y_MIGRATION",
  MNP_IN_PROGRESS = "MNP_IN_PROGRESS",
  ERR_MNP = "ERR_MNP",
  ERR_SIMATI = "ERR_SIMATI",
  SIM_REPLACE_ACTIVATION_ERR = "SIM_REPLACE_ACTIVATION_ERR",
  PAYMENT_FAILED_CREDIT_CARD = "PAYMENT_FAILED_CREDIT_CARD",
  PAYMENT_FAILED_CCV = "PAYMENT_FAILED_CCV",
  SELECT_ZERO_RATED_APP = "SELECT_ZERO_RATED_APP",
  SEND_GIFT = "SEND_GIFT",
  UNABLE_DELIVER_SIM = "UNABLE_DELIVER_SIM",
  ORDER_SIM_DELIVERY = "ORDER_SIM_DELIVERY",
  REACTIVATE_SIM = "REACTIVATE_SIM",
  INSTALL_ESIM = "INSTALL_ESIM",
  CAMPAIGN_NOTIFICATION = "CAMPAIGN_NOTIFICATION",
  TRANSFER_NUMBER_OWNERSHIP = "TRANSFER_NUMBER_OWNERSHIP",
  ACCEPT_NUMBER_OWNERSHIP = "ACCEPT_NUMBER_OWNERSHIP",
  REFUND_PENDING = "REFUND_PENDING",
  RESCHEDULE_DELIVERY = "RESCHEDULE_DELIVERY",
  DEVICE_DELIVERED = "DEVICE_DELIVERED",
  DEVICE_RETURNED = "DEVICE_RETURNED",
  DEVICE_VERIFICATION = "DEVICE_VERIFICATION",
  SUBSCRIPTION_TYPE_CHANGE = "SUBSCRIPTION_TYPE_CHANGE",
  ZAIN_FRAUD = "ZAIN_FRAUD",
}

export enum TOP_BANNER_USER_MODE {
  ACTIVATION_IN_PROGRESS = "ACTIVATION_IN_PROGRESS",
  MINI_DASHBOARD = "MINI_DASHBOARD",
  EXPIRED_PACKAGE = "EXPIRED_PACKAGE",
  SIM_BARR = "SIM_BARR",
  USER_SUSPENDED = "USER_SUSPENDED",
  ORDER_SIM = "ORDER_SIM",
  ACTIVATE_SIM = "ACTIVATE_SIM",
  ACTIVATE_MNP_SIM = "ACTIVATE_MNP_SIM",
  PAY_YOUR_PACKAGE = "PAY_YOUR_PACKAGE",
}

export enum FIRST_PACKAGE_STATUS {
  PENDING = "PENDING",
  PURCHASED = "PURCHASED",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

export enum API_REQ_STATE {
  COMPLETE = "COMPLETE",
  INPROGRESS = "INPROGRESS",
  ROLLBACK = "ROLLBACK",
}

export enum MnpErrorCode {
  ID_MISMATCH_OR_MISSING = "SP01",
  WRONG_OPERATOR_SELECTED = "SP06",
}

// SEMATI error codes
export enum SEMATI_ERROR_CODES {
  PERSON_ID_NOT_VALID = 702,
  NOT_ENROLLED_AT_NIC = 704,
  PERSON_CANNOT_TAKE_MORE_NUMBERS = 706,
  INVALID_NATIONALITY = 718,
  INVALID_SIM_NUMBER = 720,
  PERSON_ID_EXPIRED = 738,
  PERSON_HAS_FINAL_EXIT = 737,
  PERSON_UNDER_15 = 740,
  IAM_TOKEN_MISMATCH = 793,
  MOBILE_ALREADY_EXISTS = 726,
  ID_NOT_LINKED_WITH_NUMBER = 727, // not described in comments
  ID_INCORRECT = 719, // not described in comments
}

export enum USAGE_TYPE {
  Data = "PACKAGE_LOCAL_DATA",
  Calls = "PACKAGE_LOCAL_VOICE",
  Apps = "PACKAGE_SOCIAL_DATA",
  InternationalAndLocalData = "PACKAGE_INTERNATIONAL_AND_LOCAL_DATA",
  InternationalAndLocalCall = "PACKAGE_INTERNATIONAL_AND_LOCAL_VOICE",
  NationalDay = "NATIONAL_DAY_OFFER_DATA",
  FoundationDay = "FOUNDING_DAY_OFFER_DATA",
  RoamingCall = "PACKAGE_ROAMING_DATA",
  RoamingData = "PACKAGE_ROAMING_VOICE",
}

export enum ADD_ON_SKUs {
  INTERNATIONAL_CALLS_CONFIG = "international_calls_config",
  INTERNATIONAL_PACKAGE_CONFIG = "international_pkg_config",
  ROAMING_PACKAGE_CONFIG = "roaming_pkg_config",
}

export const ORDER_STATUS = {
  CREATED: "CREATED",
  SCHEDULED: "SCHEDULED",
  CANCELLED: "CANCELLED",
  SENT_TO_COURIER: "SENT_TO_COURIER",
  ON_WAY: "ON_WAY",
  DELIVERED: "DELIVERED",
  UNDELIVEREDATTEMPT: "UNDELIVEREDATTEMPT",
  ACTIVATED: "ACTIVATED",
  REPLACED_ESIM_ACTIVATED: "REPLACED_ESIM_ACTIVATED",
  IN_PROGRESS: "IN_PROGRESS",
  REPLACED_SIM_ACTIVATED: "REPLACED_SIM_ACTIVATED",
  ORDER_RECEIVED: "ORDER_RECEIVED",
  BARRED: "BARRED",
};

export enum PAYMENT_INSTALLMENT_METHOD {
  TAMAM = "TAMAM",
  TABBY = "TABBY",
  TAMARA = "TAMARA",
  EMKAN = "EMKAN",
}
