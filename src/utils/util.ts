import {
  CommonActions,
  NavigationContainerRef,
} from "@react-navigation/native";
import { OrderJourney } from "../apis/types/dashboard";
import { MSISDN_TRANSITION_TYPE, SEMATI_ERROR_CODES } from "../types";
import { InteractionManager } from "react-native";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { queryKeys } from "../apis/queryKeys";
import { QueryClient } from "@tanstack/react-query";

export const checkSimatiError = (orderJourney?: OrderJourney) => {
  const isMobileAlreadyExistsCase =
    orderJourney?.userMnpStatus?.simatiErrorCode ===
    SEMATI_ERROR_CODES.ID_INCORRECT;
  const isDataNumberOrder = orderJourney?.subscriptionType === "DATA";
  const isNewNumber =
    orderJourney?.msisdnTransitionType === MSISDN_TRANSITION_TYPE.NEW_NUMBER;
  // eligibleToRetryActivation when true for new number means just retry activation with same msisdn
  // eligibleToRetryActivation when false for new number means go to choose number page to select new msisdn
  // for port in cases : eligibleToRetryActivation true means retry and false means contact customer care
  const newNumberMobileAlreadyExists =
    isNewNumber &&
    isMobileAlreadyExistsCase &&
    !orderJourney?.eligibleToRetryActivation &&
    !isDataNumberOrder;

  return {
    newNumberMobileAlreadyExists,
    isDataNumberOrder,
    isNewNumber,
    isMobileAlreadyExistsCase,
  };
};

export const resetAndNavigate = (
  navigation: NavigationContainerRef<any>,
  routeName: string,
  params?: any,
) => {
  InteractionManager.runAfterInteractions(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params,
          },
        ],
      }),
    );
  });
};

export const closeSheetModal = () => {
  const { setActiveSheet } = useBottomSheetStore.getState();
  setActiveSheet(null);
};

export const refetchMultiLine = (queryClient: QueryClient) => {
  if (useUserPreferenceStore.getState().isMultilineLogin) {
    queryClient.refetchQueries({
      queryKey: [queryKeys.multilineAccounts],
      exact: true,
    });
    queryClient.setQueryData([queryKeys.multilinetokens], undefined);
  }
};
