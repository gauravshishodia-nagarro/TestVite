import React from "react";
import { Platform, View } from "react-native";
import { setAccessibilityProps } from "../types";
import CustomText from "./customText";

type ListType = {
  [key: string]: string | string; // Accepts dynamic keys with string values
};

type NumberLabelItemProps = {
  list: Array<ListType> | string[];
  labelKey?: string;
  containerClassName?: string;
  numberViewClassName?: string;
  numberClassName?: string;
  numberFontName?: string;
  labelClassName?: string;
  labelFontName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
};

const NumberLabelItem: React.FC<NumberLabelItemProps> = ({
  list = [],
  labelKey,
  containerClassName = "",
  numberViewClassName = "",
  numberClassName = "",
  labelClassName = "",
  numberFontName = "font-primary-medium",
  labelFontName = "font-primary-medium",
  nativeID = "number_label_item",
  accessibilityLabel,
}) => {
  return (
    <View
      className={`${containerClassName}`}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      {list?.map((item, index) => {
        const label = labelKey ? item[labelKey] : item;
        return (
          <View key={index} className={"flex-row gap-[10px] w-full"}>
            <View className="items-center">
              <View
                className={`rounded-full justify-center items-center border-shades-gray-06 border-[1px] w-[32px] h-[32px] ${numberViewClassName}`}
              >
                <CustomText
                  style={{
                    includeFontPadding: false,
                    textAlignVertical: "center", // added this style as a Text was not coming at cneter on Android platform
                  }}
                  className={`text-xs text-shades-gray-01 ${numberFontName} ${numberClassName}`}
                >
                  {index + 1}
                </CustomText>
              </View>
              {list?.length > 1 && index < list?.length - 1 && (
                <View className="h-[32px] bg-shades-gray-06 w-[1px] self-center flex-grow" />
              )}
            </View>
            <CustomText
              className={`text-sm mt-1 text-shades-gray-01 ${
                Platform.OS === "web" ? "text-start" : "text-left"
              } flex-1 ${labelFontName} ${labelClassName}`}
            >
              {label}
            </CustomText>
          </View>
        );
      })}
    </View>
  );
};

export default NumberLabelItem;
