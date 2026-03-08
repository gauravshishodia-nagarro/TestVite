import { useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { Action, OrderJourney } from "../apis/types/dashboard";
import {
  HOME_CARDS_ACTION,
  ONBOARDING_JOURNEY_TYPES,
  TOP_BANNER_USER_MODE,
} from "../types";
import { checkSimatiError } from "../utils/util";
import ActionCard from "./actionCard";
import GenericList from "./scrollableOptionList";
import Section from "./section";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface ActionRequiredSectionType {
  actions?: Action[];
  onActionPress?: (type: string) => void;
  orderJourney?: OrderJourney;
}

const ActonCardsSection: React.FC<ActionRequiredSectionType> = ({
  actions,
  onActionPress,
  orderJourney,
}) => {
  const maxWidthRef = useRef(0);
  const [itemWidth, setItemWidth] = useState<number | null>(null);
  const { t } = useAppTranslation();

  const {
    newNumberMobileAlreadyExists,
    isMobileAlreadyExistsCase,
    isNewNumber,
  } = checkSimatiError(orderJourney);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > maxWidthRef.current) {
      maxWidthRef.current = width;
      setItemWidth(width);
    }
  };

  const getIcon = (key: string) => {
    switch (key) {
      case HOME_CARDS_ACTION.SIM_DELIVERY_IN_PROGRESS:
        return "trackSim";
      case HOME_CARDS_ACTION.EMAIL_VERIFICATION:
        return "verifyEmail";
      case HOME_CARDS_ACTION.COMPLETE_SIM_ORDER:
        return require("../../public/images/order-sim.webp");
      case TOP_BANNER_USER_MODE.PAY_YOUR_PACKAGE:
        return "continuePayment";
      case HOME_CARDS_ACTION.SELECT_ZERO_RATED_APP:
        return require("../../public/images/unlimited-apps.webp");
      case HOME_CARDS_ACTION.MNP_IN_PROGRESS:
        return require("../../public/images/ic_time_timer.png");
      default:
        return "trackSim";
    }
  };

  const getLabel = (key: string) => {
    switch (key) {
      case HOME_CARDS_ACTION.SIM_DELIVERY_IN_PROGRESS:
        return t("action.trackSimTitle");
      case HOME_CARDS_ACTION.EMAIL_VERIFICATION:
        return t("action.verifyYourEmail");
      case HOME_CARDS_ACTION.COMPLETE_SIM_ORDER:
        return t("action.continueSimTitle");
      case HOME_CARDS_ACTION.DEVICE_VERIFICATION:
        return t("action.newDeviceLoginTitle");
      case HOME_CARDS_ACTION.ACTIVATE_SIM:
      case HOME_CARDS_ACTION.ACTIVATE_MNP_SIM:
        if (orderJourney?.orderType === ONBOARDING_JOURNEY_TYPES.NEW_SIM) {
          return t("action.activateSimTitle");
        }
        return t("action.activateEsimTitle");
      case TOP_BANNER_USER_MODE.PAY_YOUR_PACKAGE:
        return t("action.continuePayment");
      case HOME_CARDS_ACTION.INSTALL_ESIM:
        return t("action.esimNotUsedTitle");
      case HOME_CARDS_ACTION.SELECT_ZERO_RATED_APP:
        return t("action.selectUnlimitedApps");
      case HOME_CARDS_ACTION.MNP_IN_PROGRESS:
        return t("action.inProgressMNPActivationTitle");
      case HOME_CARDS_ACTION.ERR_MNP:
        return t("action.errorMnpTitle");
      case HOME_CARDS_ACTION.START_Z2Y_MIGRATION:
        return t("action.startMigrationBannerTitle");
      case HOME_CARDS_ACTION.ERR_SIMATI:
        if (newNumberMobileAlreadyExists) {
          return t("action.mobileExistsActionTitle");
        } else {
          return isMobileAlreadyExistsCase && !isNewNumber
            ? t("action.errorMnpTitle")
            : t("action.errorSematiTitle");
        }
      default:
        return "";
    }
  };

  return (
    <Section
      label={t("label.actionRequired")}
      shouldShowLength
      containerClassName="mt-6"
      length={actions?.length.toString()}
    >
      <GenericList<Action>
        data={actions}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pt-4 gap-4"
      >
        {(item) => (
          <View onLayout={handleLayout}>
            <ActionCard
              icon={getIcon(item.key)}
              text={getLabel(item.key)}
              openActionCard={() => {
                onActionPress?.(item.key);
              }}
              closeActionCard={() => {
                console.log("close");
              }}
              // we have used style as the dynamic style not working on Tailwind
              containerStyle={
                itemWidth
                  ? { width: itemWidth, justifyContent: "space-between" }
                  : undefined
              }
            />
          </View>
        )}
      </GenericList>
    </Section>
  );
};

export default ActonCardsSection;
