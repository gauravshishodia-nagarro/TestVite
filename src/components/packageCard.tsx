import { ImageBackground } from "expo-image";
import React, { ReactNode, useEffect } from "react";
import { ColorValue, Pressable, ScrollView, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import AppsIcon from "./appsIcon";
import CustomButton from "./customButton";
import CustomText from "./customText";
import GenericImage from "./image";
import PriceWithCurrencey from "./priceWithCurrencey";
import { useAppTranslation } from "../hooks/useAppTranslation";

type HighLights = {
  label: string;
  value: string;
};

type BaseProps = {
  id?: string;
  packageColor?: ColorValue;
  image: string;
  price: string;
  priceBeforeDiscount?: string;
  onButtonPress: () => void;
  selected?: boolean;
  animatedProgressVal: SharedValue<number>;
};

type ExtraProps = {
  packageLabel: string;
  packageImage: string;
  offerBadge?: ReactNode;
  highlightes: HighLights[];
  offerings: {
    label: string | ReactNode;
    items: string[];
  };
  buttonText?: string;
  isFirstOrLast?: boolean;
};

type PackageCardPropsType = BaseProps & ExtraProps;

const WIDTH = 254;
const HEIGHT = 514;
const PackageCard: React.FC<PackageCardPropsType> = (props) => {
  const theme = useUserPreferenceStore((state) => state.theme);
  const { t } = useAppTranslation();
  const {
    highlightes,
    image,
    offerings,
    onButtonPress,
    price,
    buttonText,
    priceBeforeDiscount,
    offerBadge,
    selected,
    animatedProgressVal: progress,
    isFirstOrLast,
    packageImage,
    packageLabel,
  } = props;

  const scaleX = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0, 0.4],
      Extrapolation.CLAMP
    );
  });
  const scaleY = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [1, 0.16], Extrapolation.CLAMP);
  });

  const widthVal = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.7, 2.2],
      Extrapolation.CLAMP
    );
  });
  const opacityVal = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    const transformOrigin = isFirstOrLast ? "top" : "195px top";
    return {
      width: !isFirstOrLast ? WIDTH : WIDTH / widthVal.get(),
      height: HEIGHT,
      overflow: "hidden",
      transform: [{ scaleX: scaleX.get() }, { scaleY: scaleY.get() }],
      transformOrigin: transformOrigin,
      zIndex: 0,
      opacity: opacityVal.get(),
    };
  });

  const innerContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityVal.get(),
      marginTop: 110,
    };
  });

  const unselectedItemStyle = useAnimatedStyle(() => {
    return {
      width: WIDTH,
      height: HEIGHT,
      overflow: "hidden",
      opacity: opacityVal.get(),
    };
  });

  return (
    <Pressable className="relative" onPress={onButtonPress}>
      <Animated.View
        key="bigcard"
        className="bg-secondary-white rounded-xl border border-shades-gray-06 border-t-0"
        style={selected ? animatedStyle : unselectedItemStyle}
      >
        <ImageBackground
          source={image}
          imageStyle={{
            width: 254,
            height: 220,
            borderRadius: 12,
          }}
        >
          <View className="h-[54px] w-[160px] mt-[65px] ms-5 gap-2">
            <GenericImage
              uri={packageImage}
              height="54"
              width="160"
              className="h-[54px] w-[160px]"
              resizeMode="contain"
            />

            <CustomText
              fontVarient="regular"
              className="text-base text-secondary-white"
            >
              {packageLabel}
            </CustomText>
          </View>
          <View className="absolute top-0 ">
            {offerBadge ? offerBadge : null}
          </View>
        </ImageBackground>

        <Animated.View className="p-4" style={innerContainerStyle}>
          <View className="flex-row gap-8 py-2 border-b border-b-shades-gray-06">
            {highlightes.map((highlight) => {
              return (
                <View key={highlight.label}>
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02"
                  >
                    {highlight.label}
                  </CustomText>
                  <CustomText
                    fontVarient="bold"
                    className="text-sm text-secondary-gray"
                  >
                    {highlight.value}
                  </CustomText>
                </View>
              );
            })}
          </View>
          <View className="py-3 gap-2">
            {typeof offerings.label === "string" ? (
              <CustomText
                fontVarient="regular"
                className="text-xs text-shades-gray-02"
              >
                {offerings.label}
              </CustomText>
            ) : (
              offerings.label
            )}
            <ScrollView
              contentContainerClassName="flex-row gap-2"
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {offerings.items?.map((item, i) => {
                return (
                  <AppsIcon
                    key={i}
                    imageUri={item}
                    imageWidth="w-[28px]"
                    imageHeight=""
                    imageClassName="!rounded-[6px] my-1 aspect-[1/1]"
                  />
                );
              })}
            </ScrollView>
          </View>

          <View className="my-3">
            {priceBeforeDiscount ? (
              <View className="w-[55px]">
                <PriceWithCurrencey
                  height={12}
                  customDecimalTextClassName="text-xxs"
                  showStrikeThroughLine
                  bgColor={Colors[theme].shadesGray02}
                  customTextClassName="text-xs text-shades-gray-02"
                  price={priceBeforeDiscount}
                />
              </View>
            ) : null}
            <View className="flex-row gap-2">
              <PriceWithCurrencey
                price={price}
                bgColor={Colors[theme].secondaryBlue}
                customTextClassName={`text-2xl text-secondary-blue font-primary-bold`}
                customDecimalTextClassName="text-xl"
              />
              <CustomText
                fontVarient="regular"
                className="self-end text-xs text-shades-gray-03 mb-1"
              >
                {t("label.vatIncluded")}
              </CustomText>
            </View>
          </View>
          <CustomButton
            type="outlined"
            onPress={onButtonPress}
            label={buttonText ?? "View Details"}
            size="small"
            labelClassName="py-1"
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export const SmallPackageCard: React.FC<BaseProps> = ({
  selected,
  animatedProgressVal: progress,
  packageColor,
  price,
  image,
  onButtonPress,
}) => {
  const theme = useUserPreferenceStore((state) => state.theme);
  const scaleY = useSharedValue(1);

  const smscaleX = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
  });

  useEffect(() => {
    scaleY.value = withTiming(selected ? 1 : 0.85, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, scaleY]);

  const smallCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: smscaleX.get() }, { scaleY: scaleY.value }],
      transformOrigin: "bottom",
      borderColor: packageColor,
      borderWidth: 1,
      backgroundColor: packageColor,
      height: 90,
      width: 114,
      borderRadius: 12,
      paddingInline: 12,
      paddingBlock: 16,
      zIndex: 1,
    };
  });

  const smallCardUnselectedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
      backgroundColor: "#fff",
      borderColor: Colors[theme].shadesGray05,
      borderWidth: 1,
      height: 90,
      width: 114,
      borderRadius: 12,
      paddingInline: 12,
      paddingBlock: 16,
      zIndex: 1,
      transform: [{ scaleY: scaleY.value }],
      transformOrigin: "bottom",
    };
  });
  const textColor = selected ? "text-secondary-white" : "text-shades-gray-04";
  return (
    <Pressable onPress={onButtonPress}>
      <Animated.View
        key="smallcard"
        style={selected ? smallCardStyle : smallCardUnselectedStyle}
      >
        <GenericImage
          width="80"
          height="20"
          className="h-5 w-[80px] rounded-xl self-start mt-1 mb-3"
          resizeMode="contain"
          uri={image}
        />
        <PriceWithCurrencey
          price={price}
          bgColor={
            selected ? Colors[theme].secondaryWhite : Colors[theme].shadesGray04
          }
          customTextClassName={`text-sm ${textColor} font-primary-medium`}
          customDecimalTextClassName="text-xs"
        />
      </Animated.View>
    </Pressable>
  );
};

export default PackageCard;
