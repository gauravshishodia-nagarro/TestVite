import React from "react";
import { View } from "react-native";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";

type CustomFooterProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  showShadow?: boolean;
};

const CustomFooter: React.FC<CustomFooterProps> = ({
  children,
  className = "",
  containerClassName = "",
  nativeID = "custom_footer",
  accessibilityLabel,
  showShadow = true,
}) => {
  const { theme } = useUserPreferenceStore();
  return (
    <View
      className={`absolute bottom-0 start-0 end-0 bg-secondary-white ${className}`}
      style={
        showShadow
          ? {
              // iOS shadow
              shadowColor: Colors[theme].black, // for iOS shadow
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,

              // Android shadow
              elevation: 5, // for Android shadow
            }
          : null
      }
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <View className={`p-4 ${containerClassName}`}>{children}</View>
    </View>
  );
};

export default CustomFooter;
