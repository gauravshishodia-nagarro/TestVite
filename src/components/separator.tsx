import React, { memo, useMemo } from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Line } from "react-native-svg";

type SeparatorVariant = "full" | "inset" | "middle";
type Orientation = "horizontal" | "vertical";
type LineStyle = "solid" | "dashed" | "dotted";

export interface SeparatorProps {
  orientation?: Orientation;
  variant?: SeparatorVariant;
  color?: string;
  thickness?: number;
  lineStyle?: LineStyle;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

type DashSeparatorProps = {
  color: ColorValue;
  dashLength: number;
  dashGap: number;
  thickness: number;
  orientation?: "horizontal" | "verticale";
  containerClassName?: string;
};

const SeparatorComponent: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  variant = "full",
  color,
  thickness = StyleSheet.hairlineWidth,
  lineStyle = "solid",
  spacing = 0,
  style,
}) => {
  const isHorizontal = orientation === "horizontal";

  const defaultColor = "#E0E0E0";
  const finalColor = color ?? defaultColor;

  const variantStyle: ViewStyle = useMemo(() => {
    switch (variant) {
      case "inset":
        return isHorizontal ? { marginHorizontal: 16 } : { marginVertical: 16 };
      case "middle":
        return isHorizontal
          ? { alignSelf: "center", width: "60%" }
          : { alignSelf: "center", height: "60%" };
      default:
        return {};
    }
  }, [variant, isHorizontal]);

  const wrapperStyle: ViewStyle = useMemo(() => {
    return isHorizontal
      ? {
          height: thickness,
          width: "100%",
          overflow: "hidden",
          margin: spacing,
          // justifyContent: 'center',
        }
      : {
          width: thickness,
          height: "100%",
          overflow: "hidden",
          margin: spacing,
          // alignItems: 'center',
        };
  }, [isHorizontal, thickness, spacing]);

  const innerLineStyle: ViewStyle = useMemo(() => {
    if (isHorizontal) {
      return {
        height: thickness * 2,
        borderWidth: thickness,
        borderColor: finalColor,
        borderStyle: lineStyle,
      };
    } else {
      return {
        width: thickness * 2,
        borderWidth: thickness,
        borderColor: finalColor,
        borderStyle: lineStyle,
        height: "100%",
      };
    }
  }, [isHorizontal, thickness, finalColor, lineStyle]);

  return (
    <View style={[wrapperStyle, variantStyle, style]}>
      <View style={innerLineStyle} />
    </View>
  );
};

export default memo(SeparatorComponent);

export const DashedSeparator: React.FC<DashSeparatorProps> = (props) => {
  const {
    color = "#000000",
    dashLength = 5,
    dashGap = 5,
    thickness = 1,
    orientation = "horizontal",
    containerClassName,
  } = props;
  const classNames =
    orientation === "horizontal" ? "w-[100%] h-[1px]" : "h-[100%] w-[1px]";
  return (
    <View className={`${classNames} ${containerClassName}`}>
      <Svg
        height={orientation === "horizontal" ? thickness : "100%"}
        width={orientation === "horizontal" ? "100%" : thickness}
      >
        <Line
          x1={orientation === "horizontal" ? "0" : thickness / 2}
          y1={orientation === "horizontal" ? thickness / 2 : "0"}
          x2={orientation === "horizontal" ? "100%" : thickness / 2}
          y2={orientation === "horizontal" ? thickness / 2 : "100%"}
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dashLength} ${dashGap}`}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
