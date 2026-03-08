import constants from "../configs/constants";
import { setAccessibilityProps } from "../types/index";
import { Pressable } from "react-native";
import CustomText from "./customText";

const sizeVariants = {
  small: {
    container: "py-1 px-4",
    text: "text-sm",
  },
  medium: {
    container: "py-3 px-12",
    text: "text-base",
  },
  large: {
    container: "py-4 px-12",
    text: "text-lg",
  },
} as const;

interface CustomButtonProps {
  label: string | React.ReactNode;
  onPress: () => void;
  type?: "filled" | "outlined";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  accessibilityLabel?: string;
  nativeID?: string;
  filledBGColor?: string;
  filledBorderColor?: string;
  filledTextColor?: string;
  outlinedBGColor?: string;
  outlinedBorderColor?: string;
  outlinedTextColor?: string;
  containerClassName?: string;
  labelClassName?: string;
  labelFontName?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  type = "filled",
  size = "medium",
  disabled = false,
  accessibilityLabel,
  nativeID = "pressable_button",
  filledBGColor = "bg-secondary-gray",
  filledBorderColor = "border-secondary-gray",
  filledTextColor = "text-secondary-white",
  outlinedBGColor = "bg-secondary-white",
  outlinedBorderColor = "border-secondary-gray",
  outlinedTextColor = "text-secondary-gray",
  containerClassName = "",
  labelClassName,
  labelFontName,
}) => {
  const { animateAll, animateColors } = constants;
  const currentSize = sizeVariants[size];

  const isPrimary = type === "filled";
  const bgColor = isPrimary ? filledBGColor : outlinedBGColor;
  const borderColor = isPrimary ? filledBorderColor : outlinedBorderColor;
  const textColor = isPrimary ? filledTextColor : outlinedTextColor;

  const disabledStyles = disabled
    ? isPrimary
      ? "!bg-shades-gray-04 !border-shades-gray-04"
      : "!border-shades-gray-04 text-shades-gray-04"
    : "";

  const fontName = labelFontName || "font-primary-medium";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`active:scale-95 active:opacity-90 border-[1.39px] rounded-[28px] ${animateAll} ${bgColor} ${borderColor} ${disabledStyles} ${currentSize.container} ${containerClassName}`}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel,
        role: "button",
      })}
    >
      {typeof label === "string" ? (
        <CustomText
          className={`${fontName} ${currentSize.text} text-center ${animateColors} ${textColor} ${disabledStyles} ${labelClassName}`}
        >
          {label}
        </CustomText>
      ) : (
        label
      )}
    </Pressable>
  );
};

export default CustomButton;
