import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";

type LoaderProps = {
  loading: boolean;
  nativeID?: string;
  accessibilityLabel?: string;
};

const Loader: React.FC<LoaderProps> = (props) => {
  const { loading, nativeID = "loader", accessibilityLabel } = props;
  const { theme } = useUserPreferenceStore();
  return loading ? (
    <View
      className="absolute left-0 right-0 top-0 bottom-0 items-center justify-around z-[9999] bg-black/50"
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <View className="bg-secondary-white h-[50px] w-[50px] rounded-full justify-center">
        <ActivityIndicator
          animating={loading}
          color={Colors[theme].primaryRuby}
        />
      </View>
    </View>
  ) : null;
};

export default Loader;
