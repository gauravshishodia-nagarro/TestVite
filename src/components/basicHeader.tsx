import {
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import constants from "../configs/constants";
import { Colors } from "../configs/themes";
import { MobileNumberSelectionSheetProps } from "../sheets/mobileNumberSelectionSheet";
import {
  BottomSheetOptions,
  useBottomSheetStore,
} from "../stores/useBottomSheetStore";
import { useStepProgressStore } from "../stores/useStepProgressStore";
import { userJourneyStore } from "../stores/userJourneyStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";
import { closeSheetModal, refetchMultiLine } from "../utils/util";
import CustomButton from "./customButton";
import CustomText from "./customText";
import { ProgressIndicator } from "./progressIndicator";
import SVGIcon from "./svgIcon";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { isRTL } from "../utils/formatter";

type BasicHeaderProps = {
  title: string;
  leadingIcon?: string;
  onLeadingIconPress?: () => void;
  showLeadingIcon?: boolean;
  trailingIcon?: string;
  onTrailingIconPress?: () => void;
  nativeID?: string;
  accessibilityLabel?: string;
  trailingView?: React.ReactNode;
  isTitleClickable?: boolean;
  trailingIconClassName?: string;
  leadingContainerClassName?: string;
  containerClassName?: string;
};

const BasicHeader: React.FC<BasicHeaderProps> = ({
  title,
  leadingIcon = "back",
  onLeadingIconPress,
  showLeadingIcon = true,
  trailingIcon,
  onTrailingIconPress,
  nativeID = "basic-header",
  accessibilityLabel,
  trailingView,
  isTitleClickable = false,
  leadingContainerClassName,
  containerClassName,
}) => {
  const { t } = useAppTranslation();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    fontPrimaryBold,
    animateOpacity,
    actionOpacity,
    animateColors,
    routesNavigateToHomeOnBack,
    routesRequiringBackConfirmation,
  } = constants;

  const { theme } = useUserPreferenceStore();
  const { journeyName } = userJourneyStore();
  // const { showSteps, getStep } = useStepProgress();
  const { currentStep, totalSteps } = useStepProgressStore();
  const activeRoute = route.name.toLowerCase();

  console.log("activeRoute", activeRoute);
  const [showSteps, setShowSteps] = useState(false);

  const headerTopAdjustment = insets.top === 0 ? 10 : insets.top > 30 ? 60 : 35;

  const trailingIconClassName =
    trailingIcon === "share2" ? (isRTL() ? "pl-[2px]" : "pr-[2px]") : "";

  const openBottomSheet = (key: string, options: BottomSheetOptions) => {
    const { setActiveSheet } = useBottomSheetStore.getState();
    setActiveSheet(key, options);
  };

  const onManageSimPress = useCallback(() => {
    const { bottomSheetOptions } = useBottomSheetStore.getState();
    useUserPreferenceStore.getState().updateUserPreferences({
      phoneNumber: bottomSheetOptions.props?.selectedNumber,
    });

    if (Platform.OS !== "web") {
      closeSheetModal();
    }
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter
        {...props}
        bottomInset={24}
        style={{ marginHorizontal: 20 }}
      >
        <CustomButton label={t("button.change")} onPress={onManageSimPress} />
      </BottomSheetFooter>
    ),
    [onManageSimPress],
  );

  const openMyNumberBottomSheet = () => {
    openBottomSheet("mobileNumbersSelectionSheet", {
      title: t("label.myNumbers"),
      props: {
        initialNumber: title,
        numbers: [
          "05 010 23412",
          "05 010 23422",
          "05 111 23412",
          "05 050 20000",
        ],
        selectedNumber: title,
        onWebContinue: onManageSimPress,
      } as MobileNumberSelectionSheetProps,
      snapPoints: ["72%", "72%"],
      renderFooter: renderFooter,
      enableDynamicSizing: false,
    });
  };

  const handleBack = () => {
    if (onLeadingIconPress) {
      onLeadingIconPress();
    } else if (routesRequiringBackConfirmation.includes(activeRoute)) {
      askExitProcessConfirmation();
    } else if (routesNavigateToHomeOnBack.includes(activeRoute)) {
      navigateToHome();
    } else {
      navigation.goBack();
    }
  };

  const askExitProcessConfirmation = () => {
    openBottomSheet("exitProcessConfirmationSheet", {
      props: {
        handleOnExit: () => {
          closeSheetModal();
          navigateToHome();
          refetchMultiLine(queryClient);
        },
      },
      snapPoints: ["72%"],
    });
  };

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "tabs" }],
    });
  };

  const handleTitlePress = () => {
    openMyNumberBottomSheet();
  };

  const allowedRoutes: string[] = [
    "packages",
    "personal-information",
    "delivery-information",
    "review-order",
    ...(journeyName === "ORDER_SIM" ? ["[id]"] : []),
    "proceed-activation",
    "national-address",
  ];
  const isRouteContainStepProgress = allowedRoutes.includes(activeRoute);

  useFocusEffect(
    useCallback(() => {
      const showStepProgress =
        journeyName &&
        journeyName !== "ORDER_DEVICE" &&
        journeyName !== "SIM_REPLACEMENT" &&
        (activeRoute === "packages" ? totalSteps > 4 : true) &&
        isRouteContainStepProgress;

      setShowSteps(showStepProgress || false);
    }, [activeRoute, journeyName, totalSteps, isRouteContainStepProgress]),
  );
  return (
    <View>
      <View
        // TODO: NEED to check with Ravi why he has gave hardcoded height h-[120px]
        className={`${Platform.OS === "web" ? "bg-shades-purple-06" : "bg-secondary-white h-[120px]"} px-5 pb-2 ${animateColors}  ${containerClassName}`}
        style={{ paddingTop: headerTopAdjustment }}
        {...setAccessibilityProps({
          nativeID,
          accessibilityLabel,
          role: "header",
        })}
      >
        <View className="flex-row items-center justify-between h-12">
          {/* Left Icon */}
          {showLeadingIcon ? (
            <Pressable
              onPress={handleBack}
              className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity} ${leadingContainerClassName}`}
            >
              <View
                className={`${isRTL() && leadingIcon === "back" ? "rotate-180" : ""}`}
              >
                <SVGIcon
                  name={leadingIcon}
                  width={24}
                  height={24}
                  stroke={Colors[theme].black}
                />
              </View>
            </Pressable>
          ) : (
            <View className="w-10" />
          )}

          {/* Title */}
          <View className="gap-4">
            <Pressable
              className={`flex-1 flex-row justify-center items-center gap-2 ${actionOpacity} ${animateOpacity}`}
              disabled={!isTitleClickable}
              onPress={handleTitlePress}
            >
              <CustomText
                className={`text-base text-secondary-gray text-center ${fontPrimaryBold}`}
                numberOfLines={1}
              >
                {title}
              </CustomText>
              {isTitleClickable && (
                <View className="bg-black/5 rounded-full">
                  <View className="rotate-90">
                    <SVGIcon
                      name={"arrow"}
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      stroke={Colors[theme].black}
                    />
                  </View>
                </View>
              )}
            </Pressable>
            {showSteps ? (
              <ProgressIndicator
                totalSteps={totalSteps}
                currentStep={currentStep}
              />
            ) : null}
          </View>

          {/* Right Icon */}
          {trailingIcon || trailingView ? (
            trailingIcon ? (
              <Pressable
                onPress={onTrailingIconPress}
                className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity} ${trailingIconClassName}`}
              >
                <SVGIcon
                  name={trailingIcon}
                  width={trailingIcon === "share2" ? 20 : 24}
                  height={trailingIcon === "share2" ? 20 : 24}
                  viewBox={
                    trailingIcon === "share2" ? "0 0 20 20" : "0 0 24 24"
                  }
                />
              </Pressable>
            ) : (
              trailingView
            )
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>
    </View>
  );
};

export default BasicHeader;
