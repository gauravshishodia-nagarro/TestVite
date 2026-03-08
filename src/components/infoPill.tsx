import { ReactNode } from "react";
import { Platform, View } from "react-native";
import { setAccessibilityProps } from "../types";
import CustomText from "./customText";
import HtmlTextRenderer from "./htmlTextRenderer";
import { isRTL } from "../utils/formatter";

export type TextSegment = {
  text: string;
  textClassName?: string;
  weight?: "regular" | "medium" | "bold"; // font weight
};

const getFontWeightClass = (weight?: string) => {
  switch (weight) {
    case "bold":
      return "font-primary-bold";
    case "medium":
      return "font-primary-medium";
    default:
      return "font-primary-regular";
  }
};

type InfoPillProps = {
  mainContainerClassName?: string;
  texts: TextSegment[] | string;
  nativeID?: string;
  accessibilityLabel?: string;
  textClassName?: string;
  leading?: ReactNode;
};

const InfoPill: React.FC<InfoPillProps> = ({
  mainContainerClassName = "bg-secondary-white",
  texts,
  nativeID = "info_pill",
  accessibilityLabel,
  textClassName,
  leading,
}) => {
  return (
    <View
      className={`px-2 py-1 rounded-full flex-row ${mainContainerClassName}`}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      {leading && leading}
      {typeof texts === "string" ? (
        <HtmlTextRenderer
          html={texts}
          parentClassName={`font-primary-regular text-secondary-gray ${textClassName}`}
        />
      ) : (
        (!isRTL() ? texts : [...texts].reverse())?.map((segment, index) => {
          const { textClassName, text, weight } = segment;
          return (
            <CustomText
              key={index}
              className={`text-shades-gray-01 text-sm ${textClassName} ${getFontWeightClass(
                weight
              )} ${
                index > 0
                  ? Platform.OS === "web" && isRTL()
                    ? "pe-1"
                    : "ps-1"
                  : ""
              }`}
            >
              {text}
            </CustomText>
          );
        })
      )}
    </View>
  );
};

export default InfoPill;
