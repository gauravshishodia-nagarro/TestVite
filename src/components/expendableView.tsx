import React, { useState, PropsWithChildren } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type Props = {
  expanded: boolean;
  containerClassName?: string;
};
export const ExpandableView = ({
  children,
  expanded,
  containerClassName,
}: PropsWithChildren<Props>) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
    }
  };

  React.useEffect(() => {
    if (contentHeight > 0) {
      const toValue = expanded ? contentHeight : 0;
      animatedHeight.value = withTiming(toValue, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [expanded, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
      overflow: "hidden",
    };
  });

  return (
    <>
      <View className="absolute opacity-0 -left-1000" onLayout={onLayout}>
        {children}
      </View>

      <Animated.View className={containerClassName} style={animatedStyle}>
        {children}
      </Animated.View>
    </>
  );
};
