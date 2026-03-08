import { useState } from "react";
import { InteractionManager, Pressable, View } from "react-native";
import CustomButton from "../components/customButton";
import CustomText from "../components/customText";
import SVGIcon from "../components/svgIcon";
import { Colors } from "../configs/themes";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { useStepProgressStore } from "../stores/useStepProgressStore";
import { userJourneyStore } from "../stores/userJourneyStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { SIM_TYPE, setAccessibilityProps } from "../types";
import { closeSheetModal } from "../utils/util";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { useNavigation } from "@react-navigation/native";

export type StartSimOrderSheetProps = {
  nativeID?: string;
  accessibilityLabel?: string;
  showBackIcon?: boolean;
  isPackageSelected?: boolean;
};

const StartSimOrderSheet: React.FC = () => {
  const { bottomSheetOptions } = useBottomSheetStore();
  const { t } = useAppTranslation();

  const {
    nativeID = "start_sim_order_sheet",
    accessibilityLabel,
    isPackageSelected = false,
  }: StartSimOrderSheetProps = bottomSheetOptions.props;
  const { theme } = useUserPreferenceStore();
  const navigation = useNavigation();
  const { setJourneyState, selectedPackage, simType } = userJourneyStore();
  const [selectedSimType, setSimType] = useState<SIM_TYPE>(
    simType ||
      (selectedPackage && selectedPackage?.package_for !== "default"
        ? SIM_TYPE.ESIM
        : SIM_TYPE.PHYSICAL),
  );

  const { setTotalSteps } = useStepProgressStore();

  const handleContinue = () => {
    closeSheetModal();
    setTotalSteps(isPackageSelected ? 4 : 5);
    setJourneyState({
      journeyName: "ORDER_SIM",
      simType: selectedSimType,
    });

    InteractionManager.runAfterInteractions(() => {
      if (!isPackageSelected) {
        navigation.navigate("packages", {
          title: t("action.orderSIM"),
        });
      } else {
        //TODO: create stack
        navigation.navigate("personalInformation", {
          title:
            selectedSimType === SIM_TYPE.ESIM
              ? t("label.orderESIM")
              : t("action.orderSIM"),
        });
      }
    });
  };

  return (
    <View
      className="bg-shades-purple-06 pb-8 px-5 gap-6"
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <CustomText
        fontVarient="regular"
        className={`text-shades-gray-01 mt-1 text-sm text-left`}
      >
        {t("label.startSimOrderSheetSubTitle")}
      </CustomText>
      {/* </View>  */}

      <View className="flex-row gap-4 mb-6">
        <Pressable
          onPress={() => setSimType(SIM_TYPE.PHYSICAL)}
          className={`rounded-xl p-4 flex-1 gap-6 ${selectedSimType === SIM_TYPE.PHYSICAL ? "border-[1.5px] border-secondary-blue bg-shades-blue-06" : "border border-shades-gray-06"}`}
          disabled={
            selectedPackage && selectedPackage?.package_for !== "default"
          }
        >
          <SVGIcon
            name="simIcon"
            height={32}
            width={32}
            stroke={
              selectedSimType === SIM_TYPE.PHYSICAL
                ? Colors[theme].secondaryBlue
                : Colors[theme].shadesGray01
            }
          />
          <CustomText
            fontVarient="medium"
            className="text-base text-secondary-gray"
          >
            {t("common.sim")}
          </CustomText>
        </Pressable>
        <Pressable
          onPress={() => setSimType(SIM_TYPE.ESIM)}
          className={`rounded-xl p-4 flex-1 gap-6 ${selectedSimType === SIM_TYPE.ESIM ? "border-[1.5px] border-secondary-blue bg-shades-blue-06" : "border border-shades-gray-06"}`}
          disabled={
            selectedPackage &&
            !(
              selectedPackage?.package_for === "esim" ||
              selectedPackage?.esimPackage?.package_for === "esim"
            )
          }
        >
          <SVGIcon
            name="esimIcon"
            height={32}
            width={32}
            pathFill={
              selectedSimType === SIM_TYPE.ESIM
                ? Colors[theme].secondaryBlue
                : Colors[theme].shadesGray01
            }
          />
          <CustomText
            fontVarient="medium"
            className="text-base text-secondary-gray"
          >
            {t("label.esim")}
          </CustomText>
        </Pressable>
      </View>

      <View className="gap-3">
        <CustomButton
          label={t("button.continueOrder")}
          onPress={handleContinue}
        />
        <CustomButton
          type="outlined"
          label={t("button.cancel")}
          onPress={closeSheetModal}
          containerClassName="bg-transparent"
        />
      </View>
    </View>
  );
};
export default StartSimOrderSheet;
