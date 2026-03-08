import { MotiView } from "moti";
import React from "react";
import { Pressable, View } from "react-native";
import { setAccessibilityProps } from "../types";
import GenericImage from "./image";
import SVGIcon from "./svgIcon";

interface AppsIconProps {
  editable?: boolean;
  onEditPress?: () => void;
  imageUri: string;
  imageWidth?: string;
  imageHeight?: string;
  imageClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  containerClassName?: string;
}

const AppsIcon: React.FC<AppsIconProps> = ({
  editable = false,
  onEditPress = () => {},
  imageUri,
  imageWidth = "w-[48px]",
  imageHeight = "",
  imageClassName = "rounded-2xl border border-shades-purple-06 aspect-[1/1]",
  nativeID = "apps_icon",
  accessibilityLabel,
  containerClassName = "",
}) => {
  const renderChild = () => {
    return (
      <>
        {editable && (
          <View className="z-[1] top-[-7px] end-[-7px] absolute w-[24px] h-[24px] border-2 border-secondary-white bg-shades-purple-06 rounded-full flex items-center justify-center">
            <SVGIcon
              name={"pencil"}
              width={16}
              height={16}
              viewBox="0 0 16 16"
            />
          </View>
        )}
        <GenericImage
          uri={imageUri}
          width={imageWidth}
          height={imageHeight}
          className={`${imageClassName} ${editable ? "" : containerClassName}`}
        />
      </>
    );
  };
  return editable ? (
    <MotiView
      from={{ rotate: "-2.3deg" }}
      animate={{ rotate: "2.3deg" }}
      transition={{
        type: "timing",
        duration: 180,
        repeat: Number.POSITIVE_INFINITY,
      }}
      className={`relative ${containerClassName}`}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel: accessibilityLabel,
      })}
    >
      <Pressable onPress={onEditPress}>{renderChild()}</Pressable>
    </MotiView>
  ) : (
    renderChild()
  );
};

export default AppsIcon;
