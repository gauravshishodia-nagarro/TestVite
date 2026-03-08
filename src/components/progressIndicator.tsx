import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressIndicator({ currentStep, totalSteps }: Props) {
  const theme = useUserPreferenceStore((state) => state.theme);

  const steps = Array.from({ length: totalSteps });

  // One animated value per step
  const animatedValues = useRef(steps.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((anim, i) => {
      const stepIndex = i + 1;

      const toValue =
        stepIndex < currentStep ? 1 : stepIndex === currentStep ? 0.5 : 0;

      return Animated.timing(anim, {
        toValue,
        duration: 600,
        useNativeDriver: false, // width animation requires false
      });
    });

    Animated.parallel(animations).start();
  }, [currentStep]);

  return (
    <View className="flex-row gap-1 justify-center">
      {steps.map((_, i) => {
        const stepIndex = i + 1;
        const isActive = stepIndex <= currentStep;

        const width = animatedValues[i].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["0%", "50%", "100%"],
        });

        return (
          <View
            key={i}
            className="h-[6px] w-[32px] bg-shades-gray-06 rounded-[22px]"
          >
            <Animated.View
              style={{
                height: "100%",
                width,
                borderRadius: 22,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={
                  isActive
                    ? [
                        Colors[theme].shadesGreen04,
                        Colors[theme].secondaryGreen,
                      ]
                    : ["transparent", "transparent"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}
