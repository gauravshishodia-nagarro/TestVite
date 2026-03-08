import { MotiText } from "moti";
import React, { ReactNode } from "react";
import { View } from "react-native";
import constants from "../configs/constants";
import { useUserNavigationStore } from "../stores/userNavigationStore";
import { setAccessibilityProps } from "../types";
import CustomText from "./customText";
import HtmlTextRenderer from "./htmlTextRenderer";
import GenericImage from "./image";
import { isRTL } from "../utils/formatter";

type TextSegment = { text: string; isBold?: boolean };

type CardFeatureItemProps = {
  imageUrl: string;
  textContent: TextSegment[] | string;
  containerClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  imageWidth?: string;
  imageHeight?: string;
  keyName?: string;
  badgeView?: ReactNode;
};

const CardFeatureItem: React.FC<CardFeatureItemProps> = ({
  imageUrl,
  textContent,
  containerClassName = "px-1 py-2",
  imageClassName = "",
  textClassName = "",
  nativeID = "package_feature_item",
  accessibilityLabel,
  imageWidth = "w-6",
  imageHeight = "h-6",
  keyName,
  badgeView,
}) => {
  const { animateColors } = constants;
  const { packageTabIndex } = useUserNavigationStore();
  const renderTextContent = () => {
    if (typeof textContent === "string") {
      return (
        <>
          <HtmlTextRenderer
            html={textContent}
            parentClassName={`font-primary-regular text-secondary-gray ${textClassName}`}
          />
          {badgeView}
        </>
      );
    }

    return (
      <View className="flex-row flex-wrap items-baseline">
        {(textContent as TextSegment[])?.map((segment, index) => {
          const isBold = segment?.isBold;
          if (isBold) {
            return (
              <MotiText
                key={(keyName ?? index) + packageTabIndex.toString() + index}
                transition={{ duration: 750, type: "timing", delay: 100 }}
                from={{
                  scale: 1.15,
                }}
                animate={{
                  scale: 1,
                }}
                className={`${textClassName} font-primary-bold text-base text-secondary-gray`}
              >
                {isRTL() && index !== textContent?.length - 1 && " "}
                {segment?.text}
                {!isRTL() && index !== textContent?.length - 1 && " "}
              </MotiText>
            );
          } else {
            return (
              <CustomText
                key={index}
                className={`font-primary-regular text-base text-secondary-gray ${textClassName}`}
              >
                {isRTL() && index !== textContent?.length - 1 && " "}
                {segment?.text}
                {!isRTL() && index !== textContent?.length - 1 && " "}
              </CustomText>
            );
          }
        })}
        {badgeView}
      </View>
    );
  };

  return (
    <View
      className={`flex-row items-center gap-2 w-full ${containerClassName} ${animateColors}`}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <GenericImage
        uri={imageUrl}
        className={`${imageClassName}`}
        width={imageWidth}
        height={imageHeight}
      />
      {renderTextContent()}
    </View>
  );
};

export default CardFeatureItem;
