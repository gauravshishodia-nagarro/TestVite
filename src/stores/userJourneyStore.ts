// import { SelectedCategoriesType } from '@/app/devices/details';
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { NumberItem, OperatorsType } from "../apis/types/netcracker";
import { PackageType } from "../apis/types/store";
import { ExpiredPackage } from "../apis/types/telcoProvision";
// import { Address, Coordinates } from '../hooks/useCurrentLocation';
import { MSISDN_TRANSITION_TYPE, SIM_TYPE } from "../types";

export type UserJourneyType =
  | "ORDER_SIM"
  | "ACTIVATE_SIM"
  | "ACCOUNT_CREATION"
  | "SWITCH_NUMBER"
  | "ORDER_DEVICE"
  | "ORDER_PACKAGE"
  | "RESCHEDULE_ORDER"
  | "SIM_REPLACEMENT";
export type JourneyStartPoint = "Store" | "Package";
export type VerifiedBy = "PASSPORT" | "NATIONAL_ID";

interface UserJourneyState {
  setJourneyState: (updates: Partial<UserJourneyState>) => void;
  resetJourneyState: () => void;
  journeyName: UserJourneyType | undefined;
  simType: SIM_TYPE | undefined;
  selectedNumber: NumberItem | undefined; // user selected number
  selectedPlace?: { address: any; coordinates: any };
  termsAccepted: boolean;
  verifiedBy: VerifiedBy | undefined;
  selectedPackage: PackageType | undefined;
  idValue: string | undefined; // nationalId or passport
  name: string;
  countryCode: number; // nationality code
  dialCode: string;
  phoneNumber: string;
  email: string;
  nafathID?: string;
  childUserId?: string;
  childToken?: string;
  simNumber: string;
  selectedOperator?: OperatorsType;
  msisdntrnasitionType?: MSISDN_TRANSITION_TYPE | undefined;
  journeyStartedFrom?: JourneyStartPoint;
  deviceDetails?: {
    name?: string;
    sku?: string;
    price?: string;
    brand?: string;
    deviceType?: string;
    pickupLocationCode?: string;
    selectedVariant?: any;
    parentSku?: string;
    imageUrl?: string;
    // These two are for Tamam payment.
    // As per current App, if the selected slot is less that 1 day from currentd ate then we will show the alert and update the slot with the next availble slot
    showSlotAlertForTamamPaymentOption?: boolean;
    nextSlotForSelection?: number;
  };
  rescheduleDetails?: {
    orderType?: string;
    otoServiceType?: string;
    deliveryId?: string; // shipment delivery id
    shipmentId?: string; // order id
  };
  multilineRenewPackages?: ExpiredPackage[];
}

const initialState: Omit<
  UserJourneyState,
  "setJourneyState" | "resetJourneyState"
> = {
  journeyName: undefined,
  simType: undefined,
  selectedNumber: undefined,
  selectedPlace: undefined,
  termsAccepted: false,
  verifiedBy: undefined,
  selectedPackage: undefined,
  idValue: undefined,
  name: "",
  countryCode: 113,
  dialCode: "+966",
  phoneNumber: "",
  email: "",
  nafathID: undefined,
  childUserId: undefined,
  childToken: undefined,
  simNumber: " ",
  selectedOperator: undefined,
  msisdntrnasitionType: undefined,
  journeyStartedFrom: undefined,
  deviceDetails: undefined,
  rescheduleDetails: undefined,
  multilineRenewPackages: undefined,
};

export const userJourneyStore = create<UserJourneyState>()(
  devtools(
    (set) => ({
      ...initialState,
      setJourneyState: (updates) => set((state) => ({ ...state, ...updates })),
      resetJourneyState: () => set(initialState),
    }),
    { name: "UserJourneyStore" },
  ),
);
