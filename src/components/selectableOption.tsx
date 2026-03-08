import React from "react";
import { Pressable, Text } from "react-native";
import constants from "../configs/constants";
import { setAccessibilityProps } from "../types";

interface SelectableOptionProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  selectedClassName?: string;
  unSelectedClassName?: string;
  selectedTextClassName?: string;
  unSelectedTextClassName?: string;
  textClassName?: string;
  containerClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
}

const SelectableOption: React.FC<SelectableOptionProps> = ({
  label,
  selected = false,
  onPress,
  containerClassName,
  selectedClassName = "bg-secondary-gray border-secondary-gray",
  textClassName = "",
  selectedTextClassName = "text-secondary-white",
  unSelectedTextClassName = "text-secondary-gray",
  unSelectedClassName = "bg-transparent border-shades-gray-06",
  nativeID = "selectable_option",
  accessibilityLabel,
}) => {
  const { fontPrimaryMedium, animateColors } = constants;
  return (
    <Pressable
      onPress={onPress}
      className={`self-start flex-row items-center px-5 py-2 rounded-full border justify-center ${containerClassName} ${animateColors} ${selected ? selectedClassName : unSelectedClassName}`}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <Text
        className={`text-base ${fontPrimaryMedium} ${textClassName} ${animateColors} ${selected ? selectedTextClassName : unSelectedTextClassName}`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default SelectableOption;
