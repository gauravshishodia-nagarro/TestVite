import React from "react";
import { Text, TextProps } from "react-native";
import constants from "../configs/constants";
import { setAccessibilityProps } from "../types";
import { isRTL } from "../utils/formatter";

interface CustomTextProps extends TextProps {
  className?: string;
  animateColors?: boolean;
  fontVarient?: "regular" | "medium" | "bold";
}

export const fontVarientMap = {
  regular: "font-primary-regular",
  medium: "font-primary-medium",
  bold: "font-primary-bold",
};

const CustomText: React.FC<CustomTextProps> = ({
  children,
  className = "",
  nativeID = "custom_text",
  accessibilityLabel,
  fontVarient,
  ...rest
}) => {
  const { animateColors } = constants;
  const fontVarientClass = fontVarient
    ? fontVarientMap[fontVarient]
    : undefined;
  return (
    <Text
      lang={isRTL() ? "ar" : "en"}
      className={`${animateColors} ${fontVarientClass} ${className}`}
      {...rest}
      {...setAccessibilityProps({ nativeID, accessibilityLabel, role: "text" })}
    >
      {children}
    </Text>
  );
};

export default CustomText;
