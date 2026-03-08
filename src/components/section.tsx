import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import constants from "../configs/constants";
import { isRTL } from "../utils/formatter";
import CustomText from "./customText";
import SVGIcon, { IconProps } from "./svgIcon";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface BaseSectionProps {
  isCollapsible?: boolean;
  collapsed?: boolean;
  shouldShowLength?: boolean;
  shouldShowAddAction?: boolean;
  length?: string;
  collaps?: () => void;
  addAction?: () => void;
  children: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  arrowAnimateFrom?: string;
  arrowAnimateTo?: string;
  lengthViewClassName?: string;
  onSectionPress?: () => void;
  lengthClassName?: string;
  shouldShowAllAction?: boolean;
  allAction?: () => void;
  showLenghtWhenCollapsed?: boolean;
  nonCollapsableChildren?: React.ReactNode;
  trailingView?: React.ReactNode;
  isAutoHeight?: boolean;
  pressableClassName?: string;
  childHeight?: number;
  isChildCollapse?: boolean;
  collapseIconProps?: Partial<IconProps>;
  collapseIconViewClassName?: string;
}

type SectionProps =
  | (BaseSectionProps & {
      isCustomLabel?: false;
      label: string;
      customLabel?: never;
    })
  | (BaseSectionProps & {
      isCustomLabel: true;
      customLabel: React.ReactNode;
      label?: never;
    });

const Section: React.FC<SectionProps> = ({
  isCollapsible = false,
  shouldShowLength = false,
  shouldShowAddAction = false,
  isCustomLabel = false,
  customLabel = undefined,
  label,
  length = "7",
  addAction,
  children,
  containerClassName = "",
  labelClassName = "",
  arrowAnimateFrom = "270deg",
  arrowAnimateTo = "90deg",
  lengthViewClassName = "",
  onSectionPress,
  lengthClassName,
  shouldShowAllAction = false,
  allAction,
  showLenghtWhenCollapsed,
  nonCollapsableChildren,
  trailingView,
  pressableClassName,
  childHeight,
  isChildCollapse,
  collapseIconProps,
  collapseIconViewClassName,
}) => {
  const { animateColors, animateOpacity, actionOpacity } = constants;
  const measuredViewRef = useRef<View>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const { t } = useAppTranslation();
  const heightSV = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: heightSV.value,
    overflow: "hidden",
  }));

  const collaps = () => {
    heightSV.value = withTiming(!collapsed ? 0 : measuredHeight, {
      duration: 500,
    });
    setCollapsed(!collapsed);
    onSectionPress?.();
  };

  useEffect(() => {
    if (childHeight && childHeight !== 0 && measuredHeight > 0) {
      if (isChildCollapse) {
        heightSV.value = withTiming(heightSV.value - childHeight, {
          duration: 300,
        });
      } else {
        heightSV.value = withTiming(heightSV.value + childHeight, {
          duration: 300,
        });
      }
    }
  }, [childHeight, isChildCollapse, heightSV, measuredHeight]);
  return (
    <View
      className={`w-full bg-secondary-white p-4 rounded-2xl ${animateColors} ${containerClassName}`}
    >
      <Pressable onPress={collaps} className={pressableClassName}>
        <View className="flex-row justify-between items-center">
          {isCustomLabel ? (
            customLabel
          ) : (
            <CustomText
              className={`text-lg text-secondary-gray font-primary-bold ${animateColors} ${labelClassName}`}
            >
              {label}
            </CustomText>
          )}
          <View className="flex flex-row items-top gap-4 items-center">
            {shouldShowAddAction && (
              <Pressable
                onPress={addAction}
                className={`active:scale-95 ${actionOpacity} ${animateOpacity}`}
              >
                <SVGIcon
                  name={"addCircle"}
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                />
              </Pressable>
            )}

            {shouldShowLength &&
              (showLenghtWhenCollapsed ? collapsed : true) && (
                <View
                  className={`w-7 h-7 flex justify-center items-center bg-shades-purple-06 ${animateColors} rounded-full ${lengthViewClassName}`}
                >
                  <CustomText
                    className={`text-center text-sm !leading-0 text-secondary-green ${animateColors} font-primary-medium ${lengthClassName}`}
                  >
                    {length}
                  </CustomText>
                </View>
              )}

            {shouldShowAllAction && (
              <Pressable
                onPress={allAction}
                className={`flex-row items-center ${actionOpacity} ${animateOpacity}`}
              >
                <CustomText
                  className={`text-secondary-blue text-sm font-primary-medium`}
                >
                  {t("common.all")}
                </CustomText>
                <View className={`${isRTL() ? "rotate-180" : ""}`}>
                  <SVGIcon
                    name={"arrow"}
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  />
                </View>
              </Pressable>
            )}
            {isCollapsible && (
              <MotiView
                from={{ rotate: arrowAnimateFrom }}
                animate={{
                  rotate: collapsed ? arrowAnimateTo : arrowAnimateFrom,
                }}
                transition={{ type: "timing", duration: 500 }}
                className={collapseIconViewClassName}
              >
                <SVGIcon
                  name={"arrow"}
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  {...collapseIconProps}
                />
              </MotiView>
            )}
            {trailingView}
          </View>
        </View>
      </Pressable>

      {nonCollapsableChildren && nonCollapsableChildren}
      {isCollapsible && (
        <View
          ref={measuredViewRef}
          style={{ position: "absolute", opacity: 0 }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setMeasuredHeight(height);
            heightSV.value = withTiming(height, {
              duration: 500,
            });
          }}
        >
          {children}
        </View>
      )}

      {isCollapsible ? (
        <Animated.View style={[animatedStyle]} className="overflow-hidden">
          {children}
        </Animated.View>
      ) : (
        children
      )}
    </View>
  );
};

export default Section;
