import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import CustomText from "./customText";
import SVGIcon, { IconProps } from "./svgIcon";

type BaseProps = {
  label: string | ReactNode;
  iconName?: string;
  textColorClassName: string;
  containerClassName?: string;
  iconProps?: Partial<IconProps>;
  trailingView?: ReactNode;
  textFontVariant?: "regular" | "medium" | "bold";
};

type NormalBadgePorps = BaseProps & {
  gradientBadge?: false;
  bgColorClassName: string;
};
type GradientBadgePorps = BaseProps & {
  gradientBadge: true;
  gradientColors: LinearGradientProps["colors"];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: [number, number, ...number[]];
};

type BadgeProps = NormalBadgePorps | GradientBadgePorps;

const Wrapper = ({ children, ...props }: PropsWithChildren<BadgeProps>) => {
  if (props.gradientBadge) {
    return (
      <LinearGradient
        className={`flex-row py-[2px] px-2 justify-center items-center gap-2 rounded-md ${props.containerClassName}`}
        colors={props.gradientColors}
        start={props.start ?? { x: 0, y: 0.5 }}
        end={props.end ?? { x: 1, y: 1 }}
        locations={props.locations ?? [0.3, 0.7, 1]}
      >
        {children}
      </LinearGradient>
    );
  } else {
    return (
      <View
        className={`flex-row py-[2px] px-2 ${props.bgColorClassName} justify-center items-center gap-2 rounded-md ${props.containerClassName}`}
      >
        {children}
      </View>
    );
  }
};

const Badge: React.FC<BadgeProps> = (props) => {
  const {
    label,
    textColorClassName,
    iconName,
    iconProps,
    trailingView,
    textFontVariant,
  } = props;

  return (
    <Wrapper {...props}>
      {iconName ? (
        <SVGIcon name={iconName} height={14} width={14} {...iconProps} />
      ) : null}
      {typeof label === "string" ? (
        <CustomText
          fontVarient={textFontVariant || "regular"}
          className={`text-sm ${textColorClassName}`}
        >
          {label}
        </CustomText>
      ) : (
        label
      )}
      {trailingView}
    </Wrapper>
  );
};

export default Badge;
