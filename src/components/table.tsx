import React from "react";
import { View } from "react-native";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import CustomText from "./customText";
import Separator from "./separator";

export interface Row {
  name: string;
  value: string;
}

type TablePropsType = {
  data?: Row[];
};

export const Table = React.memo(({ data }: TablePropsType) => {
  const { theme } = useUserPreferenceStore();
  return data?.map((row, i) => {
    const isLast = i === data.length - 1;
    return (
      <React.Fragment key={row.name}>
        <View className="flex-row items-center">
          <View className="flex-1">
            <CustomText
              fontVarient="regular"
              className="text-sm text-shades-gray-03 text-left rtl:text-end"
            >
              {row.name}
            </CustomText>
          </View>
          <View className="flex-1">
            <CustomText
              fontVarient="medium"
              className="text-sm text-secondary-gray text-left rtl:text-end"
            >
              {row.value}
            </CustomText>
          </View>
        </View>
        {!isLast ? (
          <Separator
            variant="full"
            color={Colors[theme].shadesPurple06}
            thickness={1}
          />
        ) : null}
      </React.Fragment>
    );
  });
});
