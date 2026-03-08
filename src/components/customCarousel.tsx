import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, View, ViewStyle } from "react-native";
import { Easing, useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
  TCarouselProps,
} from "react-native-reanimated-carousel";
import { DotStyle } from "react-native-reanimated-carousel/lib/typescript/components/Pagination/Custom/PaginationItem";
import { ILayoutConfig } from "react-native-reanimated-carousel/lib/typescript/layouts/parallax";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { PackageType } from "../apis/types/store";
import { Colors } from "../configs/themes";
import { userJourneyStore } from "../stores/userJourneyStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { SIM_TYPE, setAccessibilityProps } from "../types";
import GenericImage from "./image";
import { isDataPackage } from "./packageDetails";
import PriceWithCurrencey from "./priceWithCurrencey";
import { cssInterop } from "nativewind";

cssInterop(Carousel, {
  className: "style",
});

const WIDTH = Dimensions.get("window").width;

type PaginationPosition = "top" | "center" | "bottom";
type CarouselType = "HomeParallax" | "Packages";

interface CustomCarouselProps<T> {
  data: Array<T>;
  height?: number;
  width?: number;

  mode?: any; //TCarouselProps<T>['mode'];
  modeConfig?: ILayoutConfig; //TCarouselProps<T>['modeConfig'];
  renderItem?: TCarouselProps<T>["renderItem"];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  snapEnabled?: boolean;
  pagingEnabled?: boolean;

  dotStyle?: DotStyle;
  activeDotStyle?: DotStyle;
  paginationPosition?: PaginationPosition;
  paginationContainerStyleName?: ViewStyle;
  carouselType?: CarouselType;
  containerClassName?: string;
  carouselWidth?: number;

  onItemPress?: (index: number) => void;
  initialIndex?: number;
  scrollToSelectedItemOnInit?: boolean;
  autoPlayReverse?: boolean;
  nativeID?: string;
  accessibilityLabel?: string;
  enabled?: boolean;
  onScrollEnd?: ((index: number) => void) | undefined;
  carousalRef?: React.RefObject<ICarouselInstance | null>;
}

const getDefaultRenderItem = <T,>(
  carouselType: CarouselType | undefined,
  selectedIndex: number,

  onItemPress?: (selectedIndex: number) => void,
) => {
  return ({ item, index }: CarouselRenderItemInfo<T>) => {
    const isActive = index === selectedIndex;
    const { theme } = useUserPreferenceStore();
    const { simType } = userJourneyStore();
    if (carouselType === "HomeParallax") {
      return (
        <Pressable
          className="flex-1 border-[1px] border-shades-gray-05/50 rounded-xl bg-secondary-white"
          onPress={() => onItemPress?.(index)}
        >
          <GenericImage
            className="rounded-xl"
            key={(item as any).id}
            uri={(item as any).url}
            resizeMode={"cover"}
          />
        </Pressable>
      );
    } else if (carouselType === "Packages") {
      const pkgItem = item as PackageType;
      const imageWidth = "w-[64px]";
      const imageHeight = "h-[40px]";
      const bannerTextColor =
        pkgItem.banner_text_color || Colors[theme].secondaryWhite;
      const packageColor =
        pkgItem.package_color ||
        (isDataPackage(pkgItem)
          ? Colors[theme].shadesPurple01
          : Colors[theme].primaryRuby);

      return (
        <MotiView
          from={{ height: 76, translateY: 14 }}
          animate={{
            height: isActive ? 90 : 76,
            translateY: isActive ? 0 : 14,
          }}
          exit={{ height: 76, translateY: 14 }}
          transition={{
            type: "timing",
            duration: 300,
            easing: Easing.out(Easing.cubic), // smooth easing
          }}
        >
          <LinearGradient
            key={(item as any).id}
            className={`flex-1 border-shades-gray-06 rounded-xl p-3 mx-1 ${
              isActive ? "border-0" : "border"
            }`}
            colors={
              isActive
                ? pkgItem?.package_color_gradient?.length === 2
                  ? [
                      pkgItem?.package_color_gradient[0],
                      pkgItem?.package_color_gradient[1],
                    ]
                  : [packageColor, packageColor]
                : [Colors[theme].secondaryWhite, Colors[theme].secondaryWhite]
            }
            start={{ x: 0.28, y: 1 }}
            end={{ x: 1, y: 0 }}
            locations={[0.5984, 1]}
          >
            <Pressable
              className="flex-1 gap-3 justify-center"
              onPress={() => onItemPress?.(index)}
            >
              <View
                className={`justify-center items-center ${imageWidth} ${imageHeight}`}
              >
                <GenericImage
                  uri={
                    isActive
                      ? pkgItem.package_logo_image
                      : pkgItem.package_logo_image_inactive ||
                        pkgItem.package_logo_image
                  }
                  resizeMode="contain"
                />
              </View>
              <PriceWithCurrencey
                customTextStyle={{ color: bannerTextColor }}
                price={
                  simType === SIM_TYPE.ESIM
                    ? pkgItem?.esimPackage?.price || pkgItem?.price
                    : pkgItem?.price
                }
                bgColor={
                  isActive ? bannerTextColor : Colors[theme].shadesGray04
                }
                customTextClassName={`font-primary-regular ${
                  isActive
                    ? "!text-secondary-white !text-sm"
                    : "!text-shades-gray-04 !text-xs"
                }`}
                customDecimalTextClassName={
                  isActive ? "!text-xxs" : "!text-xxxs"
                }
                height={isActive ? 22 : 16}
                width={isActive ? 14 : 11}
              />
            </Pressable>
          </LinearGradient>
        </MotiView>
      );
    }

    return <View />;
  };
};

function getPaginationMargin(
  position: PaginationPosition,
  height: number,
): ViewStyle {
  switch (position) {
    case "top":
      return { gap: 5, marginTop: -height * 0.85 };
    case "center":
      return { gap: 5, marginTop: -height * 0.5 };
    default:
      return { gap: 5, marginTop: -height * 0.15 };
  }
}

const CustomCarousel = <T extends Record<string, any>>({
  data,
  renderItem,
  mode,
  modeConfig = {
    parallaxScrollingScale: 0.85,
    parallaxScrollingOffset: WIDTH * 0.18,
  },
  height = 200,
  width = WIDTH,
  autoPlay = true,
  autoPlayInterval = 2000,
  loop = true,
  snapEnabled = true,
  pagingEnabled = true,
  dotStyle = {},
  activeDotStyle = {},
  paginationPosition = "bottom",
  paginationContainerStyleName = {},
  carouselType,
  containerClassName,
  onItemPress,
  initialIndex = 0,
  scrollToSelectedItemOnInit = false,
  autoPlayReverse = false,
  nativeID = "carousel",
  accessibilityLabel,
  enabled = true,
  onScrollEnd,
  carousalRef,
}: CustomCarouselProps<T>) => {
  const ref = carousalRef ?? useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(initialIndex);
  const { theme } = useUserPreferenceStore();

  useEffect(() => {
    setSelectedItemIndex(initialIndex);
  }, [initialIndex]);

  const handleItemPress = useCallback(
    (itemIndex: number) => {
      setSelectedItemIndex(itemIndex);
      onItemPress?.(itemIndex);
    },
    [onItemPress],
  );

  useEffect(() => {
    if (scrollToSelectedItemOnInit) {
      ref?.current?.scrollTo({ index: initialIndex });
    }
  }, [initialIndex, scrollToSelectedItemOnInit]);

  const memoizedRenderItem = useMemo(() => {
    return (
      renderItem ||
      getDefaultRenderItem<T>(
        carouselType,
        selectedItemIndex,

        handleItemPress,
      )
    );
  }, [renderItem, carouselType, selectedItemIndex, handleItemPress]);

  return (
    <View
      className={`${containerClassName}`}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <Carousel
        className={`!w-[inherit]`}
        ref={ref}
        data={data}
        width={width}
        mode={mode}
        enabled={enabled}
        defaultIndex={0}
        height={height}
        onProgressChange={progress}
        snapEnabled={snapEnabled}
        modeConfig={modeConfig}
        pagingEnabled={pagingEnabled}
        autoPlayInterval={autoPlayInterval}
        autoPlay={autoPlay}
        autoPlayReverse={autoPlayReverse}
        loop={loop}
        renderItem={memoizedRenderItem}
        onScrollEnd={onScrollEnd}
      />
      {data?.length > 2 && (
        <Pagination.Custom
          progress={progress}
          data={data}
          dotStyle={{
            backgroundColor: Colors[theme].shadesGray05,
            width: 8,
            height: 8,
            borderRadius: 4,
            ...dotStyle,
          }}
          activeDotStyle={{
            backgroundColor: Colors[theme].shadesGray05,
            width: 24,
            borderRadius: 10,
            height: 8,
            ...activeDotStyle,
          }}
          containerStyle={[
            {
              ...getPaginationMargin(paginationPosition, height),
              ...paginationContainerStyleName,
              overflow: "hidden",
              maxWidth: "80%",
            },
          ]}
        />
      )}
    </View>
  );
};

export default CustomCarousel;
