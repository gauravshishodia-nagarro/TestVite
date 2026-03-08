import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import constants from "../configs/constants";
import { Colors } from "../configs/themes";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import Badge from "./badge";
import { CouponListCardType } from "./couponListCard";
import CustomButton from "./customButton";
import CustomText from "./customText";
import GenericImage from "./image";
import Section from "./section";
import { DashedSeparator } from "./separator";
import SVGIcon from "./svgIcon";
import { useAppTranslation } from "../hooks/useAppTranslation";
export type PackageOfferCouponType = Partial<CouponListCardType> & {
  couponTitle: string;
};

type PropsType = {
  coupons: PackageOfferCouponType[];
  onCouponApplied: (coupon: PackageOfferCouponType) => void;
  onCouponRemoved?: (coupon?: string) => void;
};
const minWidth =
  Platform.OS === "web"
    ? constants.webWidth - 120
    : Dimensions.get("window").width - 120;
export const PackageOffers = ({
  coupons,
  onCouponApplied,
  onCouponRemoved,
}: PropsType) => {
  const theme = useUserPreferenceStore((state) => state.theme);
  const setActiveSheet = useBottomSheetStore((state) => state.setActiveSheet);
  const { t } = useAppTranslation();

  const [selectedCoupon, setSelectedCoupon] =
    useState<PackageOfferCouponType>();

  const handleApply = (coupon: PackageOfferCouponType) => {
    onCouponApplied(coupon);
    setSelectedCoupon(coupon);
    //api call
  };

  const applyCoupon = (coupon: string) => {
    setActiveSheet(null);
    const selectedCoupon = coupons.find((c) => c.couponCode === coupon);

    if (selectedCoupon) {
      handleApply(selectedCoupon);
    } else {
      alert(t("label.somethingWentWrong"));
    }
  };

  const handleRemoveCoupon = (coupon: string) => {
    setActiveSheet(null);
    setSelectedCoupon(undefined);
    onCouponRemoved?.(coupon);
    //api call
  };

  const openSheet = (coupon: PackageOfferCouponType) => {
    setActiveSheet("couponListSheet", {
      props: {
        showCouponInput: false,
        title: t("label.couponDetails"),
        currentCouponCode: selectedCoupon?.couponCode,
        onApplyCoupon: (c: string) => applyCoupon(c),
        onRemoveCoupon: (c: string) => handleRemoveCoupon(c),
        coupons: [
          {
            title: "",
            coupons: [
              { ...coupon, isExpanded: true, showBackGroundPattern: true },
            ],
          },
        ],
      },
      snapPoints: ["50%"],
      enableDynamicSizing: false,
    });
  };
  const gradientColors = [
    Colors[theme].primaryYellow,
    Colors[theme].secondaryYellow,
    Colors[theme].shadesYellow01,
  ] as LinearGradientProps["colors"];
  return (
    <Section
      collapsed
      isCollapsible
      isCustomLabel
      customLabel={
        <View className="flex-row items-center justify-between flex-1">
          <View className="flex-row gap-2">
            <SVGIcon name={"coupon"} width={24} viewBox="0 0 24 24" />
            <View className="gap-1">
              <CustomText
                fontVarient="bold"
                className="text-base text-secondary-gray"
              >
                {t("label.offerforyou")}
              </CustomText>
            </View>
          </View>
          <Badge
            gradientBadge
            gradientColors={gradientColors}
            textColorClassName="text-secondary-white text-[10px]"
            label={`${coupons.length} offers`}
            containerClassName="bg-secondary-yellow !px-2 !py-0 me-4 !rounded-2xl"
          />
        </View>
      }
    >
      <ScrollView
        horizontal
        className="pt-4"
        contentContainerClassName="gap-4"
        showsHorizontalScrollIndicator={false}
      >
        {coupons?.map((coupon) => {
          return (
            <LinearGradient
              key={coupon.couponCode}
              colors={[
                Colors[theme].shadesCreem06,
                Colors[theme].secondaryWhite,
              ]}
              className="border border-shades-gray-06 rounded-xl p-3"
              style={{ minWidth: minWidth }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.2, y: 1 }}
            >
              <GenericImage
                className="absolute h-[56px] w-[56px] right-0 top-0"
                height="56"
                width="56"
                uri={require("../../public/images/coupon-star.webp")}
              />
              <View className="flex-row items-center gap-1">
                <GenericImage
                  height="18"
                  width="18"
                  className="w-[18px] h-[18px]"
                  uri={require("../../public/images/yaqoot-logo.webp")}
                />
                <CustomText
                  fontVarient="bold"
                  className="text-sm text-secondary-gray"
                >
                  {coupon.couponTitle}
                </CustomText>
              </View>
              <CustomText className="mt-1 text-shades-gray-02 text-xs">
                {coupon.couponDescription}
              </CustomText>
              <DashedSeparator
                color={Colors[theme].shadesGray06}
                dashGap={4}
                dashLength={2}
                thickness={1}
                containerClassName="mt-3"
              />
              <View className="flex-row justify-between items-center mt-3 mb-1">
                <CustomButton
                  size="small"
                  onPress={() => handleApply(coupon)}
                  type={
                    coupon.couponCode === selectedCoupon?.couponCode
                      ? "outlined"
                      : "filled"
                  }
                  containerClassName="py-2"
                  label={
                    coupon.couponCode === selectedCoupon?.couponCode ? (
                      <View className="flex-row gap-2 items-center">
                        <SVGIcon
                          stroke={Colors[theme].secondaryBlue}
                          pathFill={Colors[theme].secondaryBlue}
                          name="tick"
                          height={10}
                          viewBox="2 0 20 12"
                        />
                        <CustomText
                          fontVarient="medium"
                          className="text-xs -ms-2 text-secondary-gray capitalize"
                        >
                          {t("common.applied")}
                        </CustomText>
                      </View>
                    ) : (
                      <CustomText
                        fontVarient="medium"
                        className="text-xs text-secondary-white px-2 capitalize"
                      >
                        {t("button.apply")}
                      </CustomText>
                    )
                  }
                />
                <Pressable
                  onPress={() => openSheet(coupon)}
                  className="flex-row items-center justify-center"
                >
                  <CustomText className="text-xxs text-secondary-blue">
                    {t("common.tnc")}
                  </CustomText>
                  <SVGIcon
                    stroke={Colors[theme].secondaryBlue}
                    name="arrow"
                    height={14}
                    viewBox="0 0 32 22"
                  />
                </Pressable>
              </View>
            </LinearGradient>
          );
        })}
      </ScrollView>
    </Section>
  );
};
