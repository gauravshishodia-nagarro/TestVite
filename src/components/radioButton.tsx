import { setAccessibilityProps } from "../types";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import constants from "../configs/constants";
import CustomText from "./customText";
import GenericImage from "./image";
import SVGIcon from "./svgIcon";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: (() => void) | undefined;
  nativeID?: string;
  accessibilityLabel?: string;
  radioClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  subLabel?: string;
  subLabelFont?: string;
  subLabelClassName?: string;
  trailingText?: string;
  trailingTextFont?: string;
  trailingTextClassName?: string;
  leadingIcon?: string;
  leadingIconHeight?: number;
  leadingIconWidth?: number;
  leadingIconViewBox?: string;
  leadingIconViewClassName?: string;
  subHeadingComponent?: React.ReactNode;
  presseableClassName?: string;
  viewTrailingRadio?: ReactNode;
  labelView?: ReactNode;
  isReadOnly?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
  nativeID = "radio",
  accessibilityLabel,
  radioClassName = "",
  labelClassName = "",
  containerClassName = "",
  subLabel,
  subLabelFont = constants.fontPrimaryRegular,
  subLabelClassName = "",
  trailingText,
  trailingTextFont = constants.fontPrimaryMedium,
  trailingTextClassName = "",
  leadingIcon,
  leadingIconHeight = 24,
  leadingIconWidth = 24,
  subHeadingComponent,
  leadingIconViewClassName = "",
  leadingIconViewBox,
  presseableClassName = "",
  viewTrailingRadio,
  labelView,
  isReadOnly = false,
}) => {
  const { animateColors, fontPrimaryBold } = constants;
  const isLeadingIconSVG =
    typeof leadingIcon === "string" && !leadingIcon.startsWith("http");
  return (
    <View className={`w-full ${containerClassName}`}>
      <Pressable
        onPress={onPress}
        className={`flex flex-row items-center justify-between gap-2 ${presseableClassName}`}
        {...setAccessibilityProps({
          role: "radio",
          nativeID,
          accessibilityLabel: accessibilityLabel || label,
        })}
      >
        {leadingIcon && (
          <View
            className={`items-center justify-center w-[40px] h-[40px] rounded-lg bg-shades-purple-06 ${leadingIconViewClassName}`}
          >
            {isLeadingIconSVG ? (
              <SVGIcon
                name={leadingIcon}
                width={leadingIconWidth}
                height={leadingIconHeight}
                viewBox={
                  leadingIconViewBox ||
                  `0 0 ${leadingIconWidth} ${leadingIconHeight}`
                }
              />
            ) : (
              <GenericImage
                uri={leadingIcon}
                width={`w-[${leadingIconWidth}px]`}
                height={`h-[${leadingIconHeight}px]`}
                resizeMode="contain"
              />
            )}
          </View>
        )}
        {label && (
          <View className="gap-[2px] flex-1 items-start">
            <CustomText
              className={`${fontPrimaryBold} text-base text-secondary-gray ${animateColors} ${labelClassName}`}
            >
              {label}
            </CustomText>
            {subLabel && (
              <CustomText
                className={`text-xs text-shades-gray-02 ${subLabelFont} ${subLabelClassName}`}
              >
                {subLabel}
              </CustomText>
            )}
            {subHeadingComponent}
          </View>
        )}
        {labelView && labelView}
        {trailingText && (
          <CustomText
            className={`flex-[0.5] text-sm text-secondary-blue ${trailingTextFont} ${trailingTextClassName}`}
          >
            {trailingText}
          </CustomText>
        )}
        {!isReadOnly && (
          <View
            className={`w-6 h-6 web:border-[2px] border-[1.5px] rounded-full flex items-center justify-center ${animateColors} ${
              selected ? "border-secondary-gray" : "border-shades-gray-05"
            } ${radioClassName}`}
          >
            <View
              className={`w-[11px] h-[11px] rounded-full ${selected ? "bg-secondary-gray" : "bg-transparent"} ${animateColors}`}
            />
          </View>
        )}
        {viewTrailingRadio}
      </Pressable>
    </View>
  );
};

export default RadioButton;
