import { FC, ReactNode } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import constants from "../configs/constants";
import CustomText from "./customText";
import Divider from "./divider";
import GenericImage from "./image";
import SVGIcon from "./svgIcon";
import GenericSwitch from "./switch";
import { isRTL } from "../utils/formatter";

type SectionItemProps = {
  /** Optional class name for customizing the container layout */
  containerClassName?: string;

  /** Disables touch feedback and onPress action for the entire row */
  disableRowPress?: boolean;

  /** Icon name to render on the left (uses SVGIcon component). Also, if we pass empty string then it will not display */
  leadingIcon?: string;

  /** Icon color to render on the left (uses SVGIcon component).*/
  leadingIconFill?: string;

  /** Label text to show in the center of the row */
  label: string;

  /** Optional class name for customizing the label */
  labelClassName?: string;

  /** Callback when the entire row is pressed (if not disabled) */
  onPress?: () => void;

  /** A custom trailing component to render on the right */
  trailing?: ReactNode;

  /** Text shown on the right along with arrow, typically used for inline actions */
  trailingText?: string;

  /** Flag to indicate a trailing switch should be rendered */
  trailingSwitch?: boolean;

  /** Boolean value that controls the switch's on/off state */
  isSwitchOn?: boolean;

  /** Callback when the trailing switch is toggled */
  onTrailingSwitchPress?: (value: boolean) => void;

  showSperator?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  iconViewBox?: string;
  leading?: ReactNode;
  leadingIconClassName?: string;
  showFallabackArrow?: boolean;
  dividerClassName?: string;
  imageWidth?: string;
  imageHeight?: string;
  subLabel?: string;
  subLabelClassName?: string;
  sublabelVariant?: "regular" | "medium" | "bold";
  bodyComponent?: ReactNode;
};

const ArrowIcon = () => (
  <View className={`${isRTL() ? "rotate-180" : ""}`}>
    <SVGIcon name="arrow" width={24} height={24} viewBox="0 0 24 24" />
  </View>
);

const SectionItem: FC<SectionItemProps> = ({
  containerClassName = "",
  disableRowPress = false,
  trailing = null,
  leadingIcon,
  label,
  subLabel,
  onPress,
  trailingText,
  trailingSwitch,
  onTrailingSwitchPress,
  isSwitchOn,
  labelClassName = "font-primary-regular",
  leadingIconFill,
  showSperator = false,
  iconHeight = 24,
  iconWidth = 24,
  iconViewBox = "0 0 24 24",
  leading = null,
  leadingIconClassName = "",
  showFallabackArrow = true,
  dividerClassName = "",
  imageHeight = "h-[32px]",
  imageWidth = "w-[32px]",
  subLabelClassName,
  sublabelVariant = "regular",
  bodyComponent,
}) => {
  const isLeadingIconSVG =
    typeof leadingIcon === "string" && !leadingIcon?.includes("/");

  const renderTrailing = () => {
    // Priority 1: if custom trailing component is passed
    if (trailing) return trailing;

    // Priority 2: if switch is enabled
    if (trailingSwitch !== undefined && onTrailingSwitchPress !== undefined) {
      return (
        <GenericSwitch value={!!isSwitchOn} onChange={onTrailingSwitchPress} />
      );
    }

    // Priority 3: if trailingText  are passed
    if (trailingText) {
      return (
        <View className="gap-2 flex-row items-center">
          <CustomText
            className={`font-primary-medium text-secondary-blue text-sm`}
          >
            {trailingText}
          </CustomText>
          <ArrowIcon />
        </View>
      );
    }
    if (showFallabackArrow) {
      // Default fallback: show arrow icon
      return <ArrowIcon />;
    }
    return null;
  };

  return (
    <TouchableOpacity
      className="w-full"
      disabled={disableRowPress}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`flex-row gap-4 items-center py-4 ${containerClassName}`}
      >
        {leading && leading}
        {leadingIcon && (
          <View className={leadingIconClassName}>
            {isLeadingIconSVG ? (
              <SVGIcon
                name={leadingIcon}
                width={iconWidth}
                height={iconHeight}
                viewBox={iconViewBox}
                pathFill={leadingIconFill}
              />
            ) : (
              <GenericImage
                uri={leadingIcon || ""}
                width={imageWidth}
                height={imageHeight}
                resizeMode="contain"
              />
            )}
          </View>
        )}
        <View className="max-w-[90%] flex-1">
          <CustomText
            className={`text-secondary-gray flex-1 text-base ${labelClassName} ${
              Platform.OS === "web" && isRTL() ? "text-right" : "text-left"
            }`}
          >
            {label}
          </CustomText>

          {subLabel && (
            <CustomText
              fontVarient={sublabelVariant}
              className={`text-shades-gray-03 flex-1 text-xs ${subLabelClassName} ${
                Platform.OS === "web" && isRTL() ? "text-right" : "text-left"
              } `}
            >
              {subLabel}
            </CustomText>
          )}
          {bodyComponent && bodyComponent}
        </View>
        {renderTrailing()}
      </View>
      {showSperator && <Divider containerClassName={dividerClassName} />}
    </TouchableOpacity>
  );
};

export default SectionItem;
