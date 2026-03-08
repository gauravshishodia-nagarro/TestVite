import { MotiView } from "moti";
import { cssInterop } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import constants from "../configs/constants";
import { setAccessibilityProps } from "../types";
import { isRTL } from "../utils/formatter";

// Create a styled MotiView component that accepts className (via NativeWind's cssInterop)
const StyledMotiView = cssInterop(MotiView, {
  className: "style",
}) as React.ComponentType<
  React.ComponentProps<typeof MotiView> & { className?: string }
>;

// Props interface for the GenericSwitch component
type GenericSwitchProps = {
  value: boolean; // Initial value of the switch
  onChange: (value: boolean) => void; // Callback when toggled
  containerClassName?: string; // Optional className for the track
  nativeID?: string; // Optional native ID for accessibility
  accessibilityLabel?: string; // Optional ARIA label
  disabled?: boolean; // Disable interaction
  offColor?: string; // Custom background color when switch is OFF
  onColor?: string; // Custom background color when switch is ON
  trackBallClassName?: string; // Optional className for the knob
  controlledCommit?: boolean; // Whether the switch toggle value is controlled externally
};

const GenericSwitch: React.FC<GenericSwitchProps> = ({
  value = false,
  onChange,
  containerClassName = "",
  nativeID = "switch_action",
  accessibilityLabel,
  disabled = false,
  offColor,
  onColor,
  trackBallClassName = "",
  controlledCommit = false,
}) => {
  const { animateColors } = constants;

  // Internal state to manage switch position
  const [isOn, setIsOn] = useState(value);

  // Keep internal state in sync if parent updates 'value' prop
  useEffect(() => {
    setIsOn(value);
  }, [value]);

  // Toggle function with useCallback for optimization
  const toggle = useCallback(() => {
    if (disabled) return;
    const newValue = !isOn;
    if (!controlledCommit) {
      setIsOn(newValue);
    }
    onChange?.(newValue);
  }, [isOn, onChange, controlledCommit, disabled]);

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel,
        role: "button",
      })}
    >
      {/* Switch track container */}
      <View
        className={`w-12 h-7 rounded-full px-1 py-1 ${
          isOn
            ? onColor || "bg-secondary-blue"
            : offColor || "bg-shades-gray-04"
        } ${animateColors} ${containerClassName}`}
      >
        {/* Switch knob (track ball) */}
        <StyledMotiView
          from={{ translateX: 0 }}
          animate={{ translateX: isOn ? (isRTL() ? -17 : 17) : 0 }}
          transition={{ type: "timing", duration: 300 }}
          className={`w-5 h-5 bg-white rounded-full shadow ${trackBallClassName}`}
        />
      </View>
    </Pressable>
  );
};

export default GenericSwitch;
