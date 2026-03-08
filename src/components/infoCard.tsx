import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";
import constants from "../configs/constants";
import { GradientColors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";
import CustomText from "./customText";
import SVGIcon from "./svgIcon";

cssInterop(LinearGradient, {
  className: "style",
});

type InfoCardProps = {
  icon: string;
  title: string;
  desciption?: string;
  containerClassName?: string;
  colors?: [string, string, ...string[]];
  start?: LinearGradientPoint | null | undefined;
  end?: LinearGradientPoint | null | undefined;
  onPress: () => void;
  locations?: [number, number, ...number[]] | null | undefined;
  titleClassName?: string;
  descriptionClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  iconContainerClassName?: string;
  mainContainerClassName?: string;
  backGroundImage?: ImageSourcePropType;
};

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  desciption,
  containerClassName = "",
  colors,
  start,
  end,
  onPress,
  locations,
  titleClassName = "",
  nativeID = "info_card",
  accessibilityLabel,
  descriptionClassName = "",
  iconContainerClassName = "",
  mainContainerClassName = "",
  backGroundImage,
}) => {
  const { animateColors } = constants;
  const { theme } = useUserPreferenceStore();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel,
        role: "button",
      })}
      className={mainContainerClassName}
    >
      <LinearGradient
        colors={
          colors || [
            GradientColors.rubyGradient[theme].white,
            GradientColors.rubyGradient[theme].white,
          ]
        }
        start={start}
        end={end}
        className={`rounded-xl  ${animateColors}`}
        locations={locations}
      >
        <ImageBackground source={backGroundImage}>
          <View className={`p-4 justify-between ${containerClassName} `}>
            <View
              className={`w-10 h-10 bg-secondary-smoke rounded-lg items-center justify-center ${iconContainerClassName}`}
            >
              <SVGIcon name={icon} width={24} height={24} viewBox="0 0 24 24" />
            </View>
            <CustomText
              className={`text-sm text-secondary-gray mt-4 font-primary-bold ${titleClassName} text-left text-start`}
            >
              {title}
            </CustomText>
            {desciption && (
              <CustomText
                className={`text-xs text-shades-gray-02 mt-1 font-primary-regular ${descriptionClassName} text-left text-start`}
              >
                {desciption}
              </CustomText>
            )}
          </View>
        </ImageBackground>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default InfoCard;
