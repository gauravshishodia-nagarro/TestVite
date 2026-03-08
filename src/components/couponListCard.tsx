import { LinearGradientProps } from "expo-linear-gradient";
import { ReactNode, useState } from "react";
import { ImageBackground, Pressable, View } from "react-native";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import Badge from "./badge";
import CustomButton from "./customButton";
import CustomText from "./customText";
import { ExpandableView } from "./expendableView";
import GenericImage from "./image";
import Section from "./section";
import { DashedSeparator } from "./separator";
import { useAppTranslation } from "../hooks/useAppTranslation";

export type CouponInfoCardProps = {
  isApplied: boolean;
  couponCode: string;
  couponDescription?: string | ReactNode;
  couponDescriptionClassName?: string | ReactNode;
  discountText?: string;
  onButtonPress: () => void;
  removeButtonType: "change" | "remove";
  renderFooter?: ReactNode;
  showBackGroundPattern?: boolean;
  appliedOnText?: string;
  isExpanded?: boolean;
};

export type CouponListCardType = Omit<CouponInfoCardProps, "renderFooter"> & {
  infoTextHeading?: string;
  infoText?: string[];
};

const getImage = (isApplied: boolean) => {
  if (isApplied) {
    return require("../../public/images/yaqoot-logo-tick.webp");
  } else {
    return require("../../public/images/yaqoot-logo.webp");
  }
};

export default function CouponListCard(props: CouponListCardType) {
  const {
    infoText,
    infoTextHeading,
    showBackGroundPattern,
    isExpanded = false,
  } = props;
  const [expanded, setExpanded] = useState(!!isExpanded);
  const theme = useUserPreferenceStore((state) => state.theme);
  const { t } = useAppTranslation();

  const onExpend = () => {
    setExpanded(!expanded);
  };
  return (
    <ImageBackground
      blurRadius={360}
      source={
        showBackGroundPattern
          ? require("../../public/images/coupon-bg.webp")
          : undefined
      }
      className="bg-secondary-white rounded-xl"
    >
      <CouponInfoCard {...props} />

      <View className="px-5 bg-secondary-white">
        <View className="h-5 w-5 rounded-full bg-shades-purple-06 absolute z-10 -top-[8px] -left-[10px]" />
        <DashedSeparator
          color={Colors[theme].shadesPurple06}
          dashLength={2}
          dashGap={4}
          thickness={2}
        />
        <View className="h-5 w-5 rounded-full bg-shades-purple-06 absolute z-10 -top-[8px] -right-[10px]" />
      </View>

      <View className="pt-3 pb-4 px-6 border-t-0 rounded-t-none bg-transparent rounded-b-xl">
        <ExpandableView expanded={expanded}>
          {infoTextHeading ? (
            <CustomText
              fontVarient="medium"
              className="text-sm text-secondary-gray text-start text-left"
            >
              {infoTextHeading}
            </CustomText>
          ) : null}

          <View className="mt-2 gap-2">
            {infoText?.map((t) => {
              return (
                <View className="flex-row gap-1 items-center" key={t}>
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02 self-start"
                  >
                    &bull;
                  </CustomText>
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02 text-start text-left"
                  >
                    {t}
                  </CustomText>
                </View>
              );
            })}
          </View>
        </ExpandableView>
        <View className="flex-row justify-between">
          <Pressable onPress={onExpend}>
            {!expanded ? (
              <CustomText
                fontVarient="medium"
                className="text-xs text-shades-gray-01"
              >
                {t("common.moredetails")}
              </CustomText>
            ) : null}
            {expanded ? (
              <CustomText
                fontVarient="medium"
                className="text-xs text-secondary-blue mt-3"
              >
                {t("common.viewLess")}
              </CustomText>
            ) : null}
          </Pressable>

          {!expanded ? (
            <CustomText
              fontVarient="regular"
              className="text-xxs text-shades-gray-04"
            >
              {t("common.tcapply")}
            </CustomText>
          ) : null}
        </View>
      </View>
    </ImageBackground>
  );
}

export const CouponInfoCard = (props: CouponInfoCardProps) => {
  const {
    isApplied,
    couponCode,
    couponDescription,
    couponDescriptionClassName,
    discountText,
    onButtonPress,
    renderFooter,
    removeButtonType,
    showBackGroundPattern,
    appliedOnText,
  } = props;
  const theme = useUserPreferenceStore((state) => state.theme);
  const { t } = useAppTranslation();
  const gradientColors = [
    Colors[theme].primaryYellow,
    Colors[theme].secondaryYellow,
    Colors[theme].shadesYellow01,
  ] as LinearGradientProps["colors"];

  return (
    <>
      <Section
        isCustomLabel
        customLabel
        containerClassName="!rounded-xl rounded-b-none bg-transparent"
      >
        {showBackGroundPattern ? (
          <GenericImage
            className="absolute h-[56px] w-[56px] right-0 top-0"
            height="56"
            width="56"
            uri={require("../../public/images/coupon-star.webp")}
          />
        ) : null}
        <View className="flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center gap-3">
            <GenericImage
              uri={getImage(isApplied)}
              width="40"
              height="40"
              className="w-10 h-10"
            />
            <View className="flex-1">
              <View className="flex-row mb-1">
                <CustomText
                  fontVarient="bold"
                  className="text-base text-secondary-gray"
                >
                  {couponCode}
                </CustomText>
                {discountText ? (
                  <Badge
                    gradientBadge
                    gradientColors={gradientColors}
                    textColorClassName="text-secondary-white text-[10.24px]"
                    textFontVariant="medium"
                    label={discountText}
                    containerClassName="bg-secondary-yellow !px-2 !py-0 ms-2 !rounded-2xl"
                  />
                ) : null}
              </View>
              {typeof couponDescription === "string" ? (
                <CustomText
                  fontVarient="regular"
                  className={`text-xs text-start text-left text-secondary-green ${couponDescriptionClassName} text-wrap`}
                >
                  {couponDescription}
                </CustomText>
              ) : (
                couponDescription
              )}
            </View>
          </View>

          <CustomButton
            size="small"
            onPress={onButtonPress}
            type={isApplied ? "outlined" : "filled"}
            label={
              isApplied
                ? removeButtonType === "change"
                  ? t("button.change")
                  : t("button.remove")
                : t("button.apply")
            }
            containerClassName={`${isApplied ? "bg-transparent" : ""}`}
          />
        </View>
        {appliedOnText ? (
          <Badge
            textColorClassName="text-shades-gray-02"
            bgColorClassName="bg-shades-purple-06"
            containerClassName="border border-dashed border-shades-gray-06 mt-2 self-start ms-[46px]"
            label={
              <CustomText
                fontVarient="regular"
                className="text-xxs text-shades-gray-02"
              >
                {t("common.appliedOn")}
                <CustomText
                  className="text-11 text-shades-gray-02"
                  fontVarient="medium"
                >
                  {" "}
                  {appliedOnText}
                </CustomText>
              </CustomText>
            }
            iconName="coupon"
            iconProps={{
              stroke: Colors[theme].shadesGray02,
              pathFill: "transparent",
              viewBox: "0 0 20 24",
              width: 16,
              height: 16,
            }}
          />
        ) : null}
      </Section>
      {renderFooter}
    </>
  );
};
