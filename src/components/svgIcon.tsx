import ICONS from "../configs/icons";
import type React from "react";
import { memo } from "react";
import Svg, { Path, Ellipse } from "react-native-svg";
import { SvgProps } from "react-native-svg/lib/typescript/elements/Svg";
import constants from "../configs/constants";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";

export interface IconProps extends SvgProps {
  name: keyof typeof ICONS;
  width?: number;
  height?: number;
  stroke?: string;
  pathFill?: string;
  className?: string;
}

const SVGIcon: React.FC<IconProps> = memo(
  ({ name, width = 24, height = 24, stroke, pathFill, ...props }) => {
    const { theme } = useUserPreferenceStore();
    const iconPaths = ICONS[name] || [];
    const { animateColors } = constants;

    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={animateColors}
        {...props}
      >
        {iconPaths?.map((icon, index) =>
          icon?.path ? (
            <Path
              key={index}
              d={icon.path}
              stroke={stroke || icon?.theme?.[theme]?.stroke || "none"}
              strokeWidth={icon?.strokeWidth}
              strokeLinecap={icon.strokeLinecap as "round" | "butt" | "square"}
              strokeLinejoin={
                icon.strokeLinejoin as "round" | "bevel" | "miter"
              }
              fill={pathFill || icon?.theme?.[theme]?.fill || "none"}
              strokeMiterlimit={icon.strokeMiterlimit}
            />
          ) : (
            <Ellipse
              key={index}
              {...icon.ellipse}
              fill={icon.fill || icon?.theme?.[theme]?.fill || "none"}
              stroke={icon.stroke || icon?.theme?.[theme]?.stroke || "none"}
            />
          )
        )}
      </Svg>
    );
  }
);

export default SVGIcon;
