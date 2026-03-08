import { useCallback } from "react";
import { InteractionManager, Platform, View } from "react-native";
import { useJourneyStepQuery } from "../apis/services/store";
import { PackageType } from "../apis/types/store";
import CustomButton from "../components/customButton";
import CustomText from "../components/customText";
import Loader from "../components/loader";
import NumberLabelItem from "../components/numberLabelItem";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { useStepProgressStore } from "../stores/useStepProgressStore";
import { VerifiedBy, userJourneyStore } from "../stores/userJourneyStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import {
  JourneyType,
  MSISDN_TRANSITION_TYPE,
  SIM_TYPE,
  setAccessibilityProps,
} from "../types";
import { IndentityVerificationSheetProps } from "./identityVerificationSheet";
import { isRTL } from "../utils/formatter";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { useNavigation } from "@react-navigation/native";

export type ActivateSimSheetProps = {
  nativeID?: string;
  accessibilityLabel?: string;
  simType?: SIM_TYPE;
  verifyWith?: VerifiedBy;
  idValue?: string;
  msisdn?: string;
  selectedPackage?: PackageType;
  msisdnTransitionType?: MSISDN_TRANSITION_TYPE;
};

const ActivateSimSheet: React.FC = () => {
  const isRtl = isRTL();
  const { bottomSheetOptions, setActiveSheet } = useBottomSheetStore();
  const { setJourneyState } = userJourneyStore();
  const { setTotalSteps } = useStepProgressStore();
  const { userType } = useUserPreferenceStore();
  const { t } = useAppTranslation();

  const {
    nativeID = "start_sim_order_sheet",
    accessibilityLabel,
    simType = SIM_TYPE.PHYSICAL,
    verifyWith = "NATIONAL_ID",
    idValue,
    msisdn,
    selectedPackage,
    msisdnTransitionType,
  }: ActivateSimSheetProps = bottomSheetOptions.props;
  const navigation = useNavigation();
  const isESIM = simType === SIM_TYPE.ESIM;
  // const isVerifiedByNAtionalID = verifyWith === 'NATIONAL_ID';
  const { data: joureySteps, isLoading } = useJourneyStepQuery(
    JourneyType.ACTIVATION,
    userType || "GUEST",
    {
      page: "HOME",
    }
  );

  const navigateToAbsher = useCallback(() => {
    setActiveSheet(null);
    InteractionManager.runAfterInteractions(() => {
      //TODO: stack required
      navigation.navigate("AbsherVerification", {
        title: t("label.activateESIM"),
      });
    });
  }, [navigation, setActiveSheet]);

  const handleContinue = () => {
    setActiveSheet(null);
    InteractionManager.runAfterInteractions(() => {
      setTotalSteps(3);
      setJourneyState({
        journeyName: "ACTIVATE_SIM",
        verifiedBy: verifyWith,
        simType,
        selectedNumber: { msisdn: msisdn || "", id: "", selected: true },
        idValue: idValue,
        selectedPackage: selectedPackage,
        msisdntrnasitionType: msisdnTransitionType,
      });

      if (isESIM) {
        if (verifyWith === "NATIONAL_ID") {
          //TODO: stack required
          navigation.navigate("NationalAddress", {
            title: t("label.activateESIM"),
          });
        } else {
          setActiveSheet("identityVerificationSheet", {
            props: {
              onPress: navigateToAbsher,
              type: "ABSHER",
            } as IndentityVerificationSheetProps,
            snapPoints: ["65%"],
          });
        }
      } else {
        //TODO: stack required
        navigation.navigate("ActivateSim");
      }
    });
  };

  return (
    <View
      className="bg-shades-purple-06 py-8 px-5 gap-6"
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <View className="gap-1">
        <CustomText
          className={`text-secondary-gray text-xl ${
            Platform.OS === "web" && isRtl ? "text-right" : "text-left"
          } font-primary-bold `}
        >
          {t(isESIM ? "label.activateeSIM" : "common.activateSIM")}
        </CustomText>
        <CustomText
          className={`text-shades-gray-01 text-base ${
            Platform.OS === "web" && isRtl ? "text-right" : "text-left"
          } font-primary-regular `}
        >
          {t("label.checkStepsForActivation")}
        </CustomText>
      </View>
      {joureySteps?.steps && (
        <View className="p-4 gap-4 bg-secondary-white rounded-2xl">
          <NumberLabelItem
            list={
              simType === SIM_TYPE.ESIM
                ? joureySteps?.steps.ESIM
                : joureySteps?.steps.SIM
            }
            containerClassName="py-1"
          />
        </View>
      )}
      <CustomButton label={t("button.continue")} onPress={handleContinue} />
      <Loader loading={isLoading} />
    </View>
  );
};
export default ActivateSimSheet;
