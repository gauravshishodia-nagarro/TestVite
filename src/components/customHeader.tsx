import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import constants from "../configs/constants";
import { GradientColors } from "../configs/themes";
import { DayStatusSVG, useDayStatus } from "../hooks/useDayStatus";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";
import { isRTL } from "../utils/formatter";
import CustomText from "./customText";
import SVGIcon from "./svgIcon";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { useNavigation } from "@react-navigation/native";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, {
  className: "style",
});

type CustomHeaderProps = {
  containerClassname?: string;
  dayStatusLabel?: string;
  onSubHeadingPress?: () => void;
  nativeID?: string;
  accessibilityLabel?: string;
  trailingIcon?: string;
  trailingIconContainerClassName?: string;
  onTrailingIconPress?: () => void;
  applyStokeOnTrailingIcon?: boolean;
  trailingIconStrokeColor?: string;
  isTransparent?: boolean;
  contentContainerClassName?: string;
  withBottomRadius?: boolean;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  containerClassname = "",
  dayStatusLabel = "",
  onSubHeadingPress,
  nativeID = "header",
  accessibilityLabel,
  trailingIcon,
  trailingIconContainerClassName = "",
  onTrailingIconPress,
  isTransparent = false,
  contentContainerClassName = "",
  withBottomRadius = false,
  applyStokeOnTrailingIcon = true,
  trailingIconStrokeColor = "white",
}) => {
  const { t } = useAppTranslation();
  const dayStatus = useDayStatus();
  const navigation = useNavigation();
  const { theme, name, userType, accessToken, isMultilineLogin } =
    useUserPreferenceStore();

  const isGuestUser = accessToken === null;

  const { actionOpacity, animateOpacity } = constants;
  const insets = useSafeAreaInsets();
  const headerTopAdjustment = insets.top > 30 ? 36 : insets.top > 0 ? 16 : 0; // detecting if a device have notch. if yes then adding some padding from top so that it will not overlap with device status info bar
  const customIconAlignment =
    trailingIcon === "search" ? `pt-1 ${isRTL() ? "pr-1" : "pl-1"}` : "";
  const leadingSubHeading =
    userType === "GUEST"
      ? t("label.loginOrRegister")
      : isMultilineLogin
      ? ""
      : name;

  const openMyNumberBottomSheet = () => {
    console.log("openMyNumberBottomSheet clicked");
  };

  const openOrderSimBottomSheet = () => {
    console.log("openOrderSimBottomSheet clicked");
  };

  const handleBottomSheetOpen = () => {
    !isMultilineLogin ? openOrderSimBottomSheet() : openMyNumberBottomSheet();
  };

  const handleSubHeadingPress = () =>
    onSubHeadingPress
      ? onSubHeadingPress?.()
      : !isGuestUser
      ? handleBottomSheetOpen()
      : navigation.navigate("Auth");
  const handleTrailingIconPress = () => onTrailingIconPress?.();

  const renderSubHeading = () => {
    return (
      <>
        <CustomText
          className={`text-xl text-secondary-white font-primary-bold`}
        >
          {leadingSubHeading}
        </CustomText>
        {isGuestUser ? (
          <View className={`${isRTL() ? "rotate-180" : ""}`}>
            <SVGIcon name="arrow" width={24} height={24} stroke="white" />
          </View>
        ) : (
          "ORDER_SIM" === "ORDER_SIM" && (
            <View>
              <SVGIcon name="downArrow" width={24} height={24} stroke="white" />
            </View>
          )
        )}
      </>
    );
  };

  return (
    <LinearGradient
      colors={
        isTransparent
          ? ["transparent", "transparent"]
          : [
              GradientColors.rubyGradient[theme].primaryRuby,
              GradientColors.rubyGradient[theme].secondryRuby02,
            ]
      }
      start={{ x: 0.7, y: 1 }}
      end={{ x: 1, y: 0 }}
      locations={[0.3, 1]}
      className={`px-5 py-4 w-full ${withBottomRadius} && 'rounded-b-[8px]' ${containerClassname}`}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel,
        role: "header",
      })}
    >
      <View
        className={`flex-row ${contentContainerClassName}`}
        style={{ paddingTop: headerTopAdjustment }} // dynamicall styling not working on classname so used style
      >
        <View className="gap-1 flex-1">
          <View className="flex-row items-center gap-[5px]">
            <SVGIcon name={DayStatusSVG[dayStatus]} width={24} height={24} />
            <CustomText
              className={`text-secondary-smoke text-sm font-primary-regular`}
            >
              {dayStatusLabel || t(dayStatus)}
            </CustomText>
          </View>

          <Pressable
            className={`gap-1 flex-row items-center ${actionOpacity} ${animateOpacity}`}
            onPress={handleSubHeadingPress}
          >
            {renderSubHeading()}
          </Pressable>
        </View>
        {/* ✅ Trailing icon */}
        {trailingIcon && (
          <Pressable
            className={`flex-row items-center justify-center self-end w-[40px] h-[40px] bg-secondary-smoke/15 rounded-full ${customIconAlignment} ${trailingIconContainerClassName} ${actionOpacity} ${animateOpacity}`}
            onPress={handleTrailingIconPress}
          >
            <SVGIcon
              name={trailingIcon}
              width={24}
              height={24}
              {...(applyStokeOnTrailingIcon
                ? { stroke: trailingIconStrokeColor }
                : {})}
            />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
};

export default CustomHeader;
