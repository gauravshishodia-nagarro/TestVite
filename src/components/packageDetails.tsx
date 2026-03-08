import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { useInstallmentMethodQuery } from "../apis/services/payment";
import { parsePackagesList, useGetPackagesQuery } from "../apis/services/store";
import { InstallmentMethodsResponse } from "../apis/types/payment";
import {
  PackageDetailsBannerType,
  PackageType,
  StoreCategoryType,
} from "../apis/types/store";
import constants from "../configs/constants";
import { Colors } from "../configs/themes";
import {
  BottomSheetOptions,
  useBottomSheetStore,
} from "../stores/useBottomSheetStore";
import { userJourneyStore } from "../stores/userJourneyStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { SIM_TYPE, SubscriptionType } from "../types";
import { isRTL } from "../utils/formatter";
import { SelectableList } from "./selectableList";
import AppsIcon from "./appsIcon";
import Badge from "./badge";
import CardFeatureItem from "./cardFeatureItem";
import CustomButton from "./customButton";
import CustomCarousel from "./customCarousel";
import CustomFooter from "./customFooter";
import CustomText from "./customText";
import Divider from "./divider";
import GenericImage from "./image";
import InfoPill from "./infoPill";
import PackageCard, { SmallPackageCard } from "./packageCard";
import { PackageOfferCouponType, PackageOffers } from "./packageOffers";
import { PaymentOptions } from "./paymentOptions";
import PriceWithCurrencey from "./priceWithCurrencey";
import Section from "./section";
import SectionItem from "./sectionItem";
import SVGIcon from "./svgIcon";
import { Table } from "./table";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";

export const unlimetedApps: string[] = [
  require("../../public/images/telegram.png"),
  require("../../public/images/whatsapp.png"),
  require("../../public/images/insta.png"),
  require("../../public/images/snapchat.png"),
  require("../../public/images/shahid.png"),
  require("../../public/images/netflix.png"),
  require("../../public/images/sound-cloud.png"),
  require("../../public/images/twitter.png"),
  require("../../public/images/anghami.png"),
  require("../../public/images/osm.png"),
  require("../../public/images/facebook.png"),
  require("../../public/images/youtube.png"),
  require("../../public/images/twicth.png"),
  require("../../public/images/starzplay.png"),
  require("../../public/images/jaco.png"),
  require("../../public/images/playhere.png"),
];

const isWeb = Platform.OS === "web";

const width = isWeb ? constants.webWidth : Dimensions.get("window").width;
export const isDataPackage = (item: PackageType): boolean => {
  const targetType = "data";
  return (
    item.package_behavior === targetType ||
    item.esimPackage?.package_behavior === targetType
  );
};

const coupons: PackageOfferCouponType[] = [
  {
    couponCode: "FIRSTRENEW",
    couponTitle: "Save on renewal & enjoy extra!!",
    couponDescription: "Save SAR 9 on your package price",
    discountText: "10% off",
    infoText: [
      "Get 15% discount on package price & 10 GB extra on renewal",
      "Save 20SAR (90SAR to 67SAR)",
    ],
    infoTextHeading: "Terms & Conditions",
  },
  {
    couponCode: "EXTRADATA",
    couponTitle: "Save on renewal & enjoy extra!!",
    couponDescription: "Enjoy extra 10GB on your data",
    infoText: [
      "Get 15% discount on package price & 10 GB extra on renewal",
      "Save 20SAR (90SAR to 67SAR)",
    ],
    infoTextHeading: "Terms & Conditions",
  },
  {
    couponCode: "EXTRADATA4",
    couponTitle: "Save on renewal & enjoy extra!!",
    couponDescription: "Enjoy extra 10GB on your data",
    infoText: [
      "Get 15% discount on package price & 10 GB extra on renewal",
      "Save 20SAR (90SAR to 67SAR)",
    ],
    infoTextHeading: "Terms & Conditions",
  },
  {
    couponCode: "EXTRADATA1",
    couponTitle: "Save on renewal & enjoy extra!!",
    couponDescription: "Enjoy extra 10GB on your data",
    infoText: [
      "Get 15% discount on package price & 10 GB extra on renewal",
      "Save 20SAR (90SAR to 67SAR)",
    ],
    infoTextHeading: "Terms & Conditions",
  },
  {
    couponCode: "EXTRADATA0",
    couponTitle: "Save on renewal & enjoy extra!!",
    couponDescription: "Enjoy extra 10GB on your data",
    infoText: [
      "Get 15% discount on package price & 10 GB extra on renewal",
      "Save 20SAR (90SAR to 67SAR)",
    ],
    infoTextHeading: "Terms & Conditions",
  },
];

export const isVisitPackage = (sku: string) =>
  [
    "visit1",
    "visit2",
    "visit1_esim",
    "visit2_esim",
    "visit3",
    "visit3_esim",
    "visit4",
    "visit4_esim",
  ].includes(sku);

const FLY1_PACKAGE_SKU = ["Fly1_esim", "Fly1"];

const PACKAGE_TYPE = {
  HOME_PKG: "HOME_PKG",
  DATA_PKG: "DATA_PKG",
  VOICE_PKG: "VOICE_PKG",
  ROMING_PKG: "ROMING_PKG",
} as const;

const getPackageType = (item: PackageType) => {
  const currentSku = item?.sku || item?.esimPackage?.sku || "";
  const isData =
    item.package_behavior.toLowerCase() === "data" ||
    item.esimPackage?.package_behavior.toLowerCase() === "data";
  if (FLY1_PACKAGE_SKU.includes(currentSku)) {
    return PACKAGE_TYPE.ROMING_PKG;
  } else {
    return item?.device_linking
      ? PACKAGE_TYPE.HOME_PKG
      : isData
        ? PACKAGE_TYPE.DATA_PKG
        : PACKAGE_TYPE.VOICE_PKG;
  }
};

export const isUnlimitedCalls = (sku: string) =>
  ["5x_2", "5X_esim"].includes(sku);

export const isFlyPackage = (sku: string) =>
  ["Fly1_esim", "Fly1"].includes(sku);

export const isFlexiPackage = (sku: string) =>
  ["Flexi_esim", "Flexi", "FlexUp", "FlexUp_esim"].includes(sku);

export const isMiniXPackage = (sku: string) =>
  ["Mini_X", "Mini_X_esim"].includes(sku);

export const isNitiSocial = (sku: string) =>
  ["Netii_Social", "Netii_Social_esim"].includes(sku);

export const packageType = (item?: PackageType): SubscriptionType => {
  return item?.package_behavior === "data" ? "DATA" : "VOICE";
};
type PackageDetailsType = {
  category: StoreCategoryType;
  intialPackageIndex?: number;
};

type FeatureType = {
  icon_path: string;
  segments: { text: string; format: { bold: boolean } }[];
  showApps?: boolean;
};

type FeatureListProps = {
  features: FeatureType[];
  unlimetedApps: string[];
  id: string;
  paymentoptions: InstallmentMethodsResponse[] | undefined;
  category: StoreCategoryType;
  banners: PackageDetailsBannerType[];
  currentSelectedPackage: PackageType | undefined;
};

type DeviceVariant = {
  id: string;
  title: string;
  image?: string;
};

const productData = [
  {
    name: "Brand",
    value: "Zain",
  },
  {
    name: "Model",
    value: "H155-381 (“5G CPE 5”)",
  },
  {
    name: "Network Support",
    value: "5G (NSA + SA), 4G LTE",
  },
  {
    name: "5G Speeds",
    value: "~3.6 Gbps download, ~500 Mbps upload",
  },
  {
    name: "Wi-Fi",
    value: "Wi-Fi 6 (802.11 ax), dual-band (2.4 GHz & 5 GHz)",
  },
  {
    name: "Connected Devices",
    value: "Can support up to 128 devices (per manual)",
  },
  {
    name: "Power",
    value: "12V DC, power consumption ≤ 24 W",
  },
  {
    name: "Dimensions",
    value: "~22.6 × 10.3 × 10.3 cm",
  },
  {
    name: "Weight",
    value: "~915 g",
  },
];

const FeatureList: React.FC<FeatureListProps> = React.memo(
  ({
    features,
    unlimetedApps,
    id,
    paymentoptions,
    category,
    currentSelectedPackage,
    banners,
  }) => {
    const { setActiveSheet } = useBottomSheetStore();

    const openMap = () => {
      setActiveSheet("chooseDeliveryLocationSheet", {
        snapPoints: ["90%"],
        enableDynamicSizing: false,
      });
    };
    const isHomePkg =
      currentSelectedPackage &&
      getPackageType(currentSelectedPackage) === PACKAGE_TYPE.HOME_PKG;

    if (!features?.length && !paymentoptions && !banners?.length) return null;

    return (
      <View>
        <View
          className={`bg-secondary-white px-4 pt-4 pb-1 rounded-2xl ${
            isHomePkg ? "rounded-b-none" : ""
          }`}
        >
          {banners.map((banner) => {
            return (
              <View
                key={banner.id}
                style={{ backgroundColor: banner.background_color }}
                className="flex-row items-center gap-2 px-3 py-2 rounded-[10px] bg-secondary-ruby -mx-[15px] -mt-[15px] mb-6"
              >
                <GenericImage
                  height="h-[35px]"
                  width="w-[35px]"
                  resizeMode="contain"
                  uri={banner.icon}
                />
                <CustomText
                  fontVarient="bold"
                  className="text-sm flex-1"
                  style={{ color: banner.text_color }}
                >
                  {banner.text}
                </CustomText>
              </View>
            );
          })}

          <CustomText
            className={`font-primary-bold text-lg text-secondary-gray mb-2 ${
              Platform.OS === "web" ? "text-start" : "text-left"
            }`}
          >
            {t("label.packageFeatures")}
          </CustomText>
          {features?.map((item, index) => {
            const filteredSegments = item?.segments?.map(
              ({ text, format }) => ({
                text,
                isBold: format.bold,
              }),
            );
            const isNotLastItem = index !== features?.length - 1;
            //TODO::use some identifier from BE
            const showBadge =
              category?.name.toLowerCase() === "home" && index === 0;
            return (
              <View key={index}>
                <CardFeatureItem
                  keyName={id}
                  imageUrl={item.icon_path}
                  textContent={filteredSegments}
                  containerClassName="py-4"
                  textClassName="!text-sm"
                  badgeView={
                    showBadge ? (
                      <Pressable className="ms-4" onPress={openMap}>
                        <Badge
                          bgColorClassName="bg-shades-blue-06"
                          label={t("label.checkCoverage")}
                          textColorClassName="text-secondary-blue"
                          containerClassName="rounded-lg"
                          trailingView={
                            <SVGIcon
                              name="arrow"
                              height={18}
                              width={18}
                              viewBox="0 0 22 22"
                            />
                          }
                        />
                      </Pressable>
                    ) : null
                  }
                />

                {item.showApps && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 12,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unlimetedApps?.map((appUri, index) => (
                      <AppsIcon
                        key={index}
                        imageUri={appUri}
                        imageWidth="w-[28px]"
                        imageHeight=""
                        imageClassName="!rounded-[6px] my-1 aspect-[1/1]"
                      />
                    ))}
                  </View>
                )}

                {isNotLastItem && <Divider />}
              </View>
            );
          })}
        </View>
        {isHomePkg ? (
          <View className="px-1 pb-1 bg-secondary-white rounded-b-2xl">
            <PaymentOptions installmentMethods={paymentoptions} />
          </View>
        ) : null}
      </View>
    );
  },
);

const ProductOptions = () => {
  const itemRenderer = useCallback((item: DeviceVariant, selected: boolean) => {
    const isOutOfStock = item.id === "2";

    return (
      <>
        <View
          key={item.id}
          className={`border-[1.5px] w-[90px] h-[114px] rounded-xl me-3 gap-2 p-3 items-center justify-center ${
            selected ? "border-secondary-blue" : "border-shades-gray-06"
          } ${isOutOfStock ? "opacity-60" : "opacity-100"}`}
        >
          <View className="h-[56px] w-[53px]">
            {/* //TODO image from api */}
            <GenericImage uri={item.image ?? ""} resizeMode="contain" />
          </View>

          <CustomText
            fontVarient="medium"
            className={`text-sm text-center ${
              selected ? "text-secondary-blue" : "text-shades-gray-01"
            }`}
          >
            {item.title}
          </CustomText>
        </View>
        {isOutOfStock ? (
          <View className="absolute w-[90px] bg-shades-ruby-05 p-2 top-[45px]">
            <CustomText
              fontVarient="bold"
              className="text-xs text-secondary-ruby text-center"
            >
              Out of stock
            </CustomText>
          </View>
        ) : null}
      </>
    );
  }, []);

  return (
    <Section isCustomLabel customLabel>
      <CustomText
        fontVarient="bold"
        className="text-base text-secondary-gray mb-4 text-left rtl:text-end"
      >
        Router Color
      </CustomText>
      <SelectableList
        onSelectionChange={(selected) => {
          console.log(selected);
        }}
        direction="row"
        keyExtractor={(item) => item.id}
        data={[
          {
            title: "White",
            id: "1",
            image: require("../../public/images/router.png"),
          },
          {
            title: "Green",
            id: "2",
            image: require("../../public/images/router.png"),
          },
        ]}
        renderItem={itemRenderer}
        filterDisabled={(item) => item.id === "2"}
      />
    </Section>
  );
};

const PackageDetails: React.FC<PackageDetailsType> = ({
  category,
  intialPackageIndex,
}) => {
  const [selectePackageIndex, setSelectedPackageIndex] = useState<
    number | null
  >(null);
  const { data: installmentMethods } = useInstallmentMethodQuery();
  const { theme } = useUserPreferenceStore();
  const { t } = useAppTranslation();
  const navigation = useNavigation();
  const {
    journeyName,
    simType,
    setJourneyState,
    journeyStartedFrom,
    resetJourneyState,
  } = userJourneyStore();
  const { data: packageData } = useGetPackagesQuery();
  const packages = packageData?.packages ?? [];
  const { setActiveSheet } = useBottomSheetStore.getState();
  const openBottomSheet = useCallback(
    (key: string, options: BottomSheetOptions) => {
      setActiveSheet(key, options);
    },
    [setActiveSheet],
  );

  const currentPackages = useMemo(() => {
    const parsedPackages = parsePackagesList(
      packages?.filter((pkg) => category?.skus?.includes(pkg.sku)),
    );
    if (simType) {
      return parsedPackages.filter((item) =>
        simType === SIM_TYPE.ESIM
          ? item.package_for === "esim" ||
            item.esimPackage?.package_for === "esim"
          : item.package_for === "default",
      );
    } else {
      return parsedPackages;
    }
  }, [category?.skus, packages, simType]);

  const currentSelectedPackage =
    selectePackageIndex !== undefined && selectePackageIndex !== null
      ? currentPackages?.[selectePackageIndex]
      : undefined;

  const openConnectWithBottomSheet = useCallback(() => {
    if (journeyStartedFrom === "Store") {
      setJourneyState({
        selectedPackage: currentSelectedPackage,
      });
      navigation.navigate("PersonalInformation", {
        title:
          journeyName === "ORDER_SIM"
            ? simType === SIM_TYPE.ESIM
              ? t("label.orderESIM")
              : t("action.orderSIM")
            : t("action.transferYaqoot"),
      });
    } else {
      resetJourneyState();
      setJourneyState({
        selectedPackage: currentSelectedPackage,
        journeyStartedFrom: "Package",
      });
      openBottomSheet("connectWithYaqootSheet", {
        snapPoints: ["72%", "90%"],
      });
    }
  }, [
    journeyName,
    simType,
    navigation.navigate,
    setJourneyState,
    journeyStartedFrom,
    resetJourneyState,
    currentSelectedPackage,
    openBottomSheet,
  ]);

  const handleBuyButton = useCallback(() => {
    if (!currentSelectedPackage?.sku) {
      alert("Package SKU not available");
      return;
    }
    openConnectWithBottomSheet();
  }, [currentSelectedPackage?.sku, openConnectWithBottomSheet]);

  const openFaqBottomSheet = useRef(() => {
    openBottomSheet("faqs", {
      snapPoints: ["72%", "90%"],
    });
  }).current;

  const openExplorAddonSheet = useRef(() => {
    openBottomSheet("exploreAddonSheet", {
      snapPoints: ["80%"],
    });
  }).current;

  const smcarouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const [isMinimized, setMinimize] = useState(false);
  const handleCardPress = useCallback(
    (index: number) => {
      setSelectedPackageIndex(index);
      setMinimize(true);
      const jumpIndex =
        index === 0 || index === currentPackages?.length - 1
          ? index
          : index - 1;
      smcarouselRef.current?.scrollTo({ index: jumpIndex });
      progress.value = withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.quad),
      });
    },
    [progress, currentPackages],
  );

  const sectionHeight = useMemo(() => {
    return {
      from: isVisitPackage(currentSelectedPackage?.sku ?? "") ? 200 : 144,
      to: isVisitPackage(currentSelectedPackage?.sku ?? "") ? 600 : 572,
    };
  }, [currentSelectedPackage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        progress.value,
        [1, 0],
        [sectionHeight.from, sectionHeight.to],
      ),
    };
  });
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  const memoizedCarousel = useMemo(() => {
    const isRTLDirection = isRTL();
    const data = isRTLDirection
      ? [...currentPackages].reverse()
      : currentPackages;
    // const initialIndex =
    // 	isRTLDirection && data.length > 0 ? data.length - 1 : 0;
    const initialIndex = isRTLDirection
      ? data?.length - 1 - (intialPackageIndex ?? 0) // reverse mapping
      : intialPackageIndex;
    const scrollToSelectedItemOnInit = isRTLDirection && data?.length > 1;
    const getPackageLabel = (pkgType: keyof typeof PACKAGE_TYPE) => {
      switch (pkgType) {
        case PACKAGE_TYPE.HOME_PKG:
          return t("label.homePackage");
        case PACKAGE_TYPE.VOICE_PKG:
          return t("label.voicePackage");
        case PACKAGE_TYPE.DATA_PKG:
          return t("label.dataPackage");
        case PACKAGE_TYPE.ROMING_PKG:
          return t("label.dataPackage");
        default:
          return t("label.voicePackage");
      }
    };
    const renderBigCard = ({
      item,
      index,
    }: {
      item: PackageType;
      index: number;
    }) => {
      const pkgItem = item;
      const isFirstOrLast =
        index === 0 || index === currentPackages?.length - 1;
      return (
        <View>
          <PackageCard
            isFirstOrLast={isFirstOrLast}
            packageColor={pkgItem?.package_color}
            id={pkgItem?.id.toString()}
            animatedProgressVal={progress}
            selected={selectePackageIndex === index}
            packageImage={pkgItem.package_logo_image}
            packageLabel={getPackageLabel(getPackageType(pkgItem))}
            image={require("../../public/images/package-bg.webp")}
            highlightes={[
              { label: "Local Calls", value: "400 mins" },
              { label: "Data", value: "7 GB" },
            ]}
            offerings={{
              label: "Choose upto 7 unlimited apps from the available list",
              items: [
                require("../../public/images/telegram.png"),
                require("../../public/images/whatsapp.png"),
                require("../../public/images/insta.png"),
                require("../../public/images/snapchat.png"),
                require("../../public/images/shahid.png"),
                require("../../public/images/netflix.png"),
                require("../../public/images/sound-cloud.png"),
              ],
            }}
            onButtonPress={() => handleCardPress(index)}
            price={pkgItem?.price.toString()}
            // priceBeforeDiscount={'57'}
            offerBadge={
              <Badge
                iconName="coupon"
                label="15% OFF + 10GB extra data"
                bgColorClassName="bg-secondary-yellow"
                textColorClassName="text-white text-xs"
                containerClassName="rounded-tr-none"
                iconProps={{
                  viewBox: "0 0 22 22",
                  pathFill: "white",
                }}
              />
            }
          />
        </View>
      );
    };

    const renderSmallCard = ({
      item,
      index,
    }: {
      item: PackageType;
      index: number;
    }) => {
      const pkgItem = item;
      const isActive = index === selectePackageIndex;
      return (
        <SmallPackageCard
          packageColor={pkgItem?.package_color}
          id={pkgItem?.id.toString()}
          animatedProgressVal={progress}
          selected={selectePackageIndex === index}
          image={
            isActive
              ? pkgItem.package_logo_image
              : pkgItem.package_logo_image_inactive ||
                pkgItem.package_logo_image
          }
          onButtonPress={() => setSelectedPackageIndex(index)}
          price={pkgItem?.price.toString()}
        />
      );
    };

    return (
      <>
        <Animated.View
          className="ps-4"
          style={[
            {
              zIndex: isMinimized ? 1 : 0,
              top: isVisitPackage(currentSelectedPackage?.sku ?? "") ? 72 : 16,
              position: "absolute",
            },
            animatedOpacity,
          ]}
        >
          <CustomCarousel<PackageType>
            carousalRef={smcarouselRef}
            data={data}
            initialIndex={initialIndex}
            width={130}
            height={144}
            autoPlay={false}
            mode={undefined}
            paginationContainerStyleName={{
              marginTop: -40,
              ...(isRTLDirection && { flexDirection: "row-reverse" }),
            }}
            carouselWidth={width - 36}
            loop={false}
            renderItem={renderSmallCard}
            scrollToSelectedItemOnInit={scrollToSelectedItemOnInit}
            containerClassName="bg-secondary-white mb-4"
          />
        </Animated.View>

        <Animated.View style={{ zIndex: isMinimized ? 0 : 1 }}>
          <CustomCarousel<PackageType>
            data={data}
            initialIndex={initialIndex}
            scrollToSelectedItemOnInit={scrollToSelectedItemOnInit}
            width={270}
            height={514}
            autoPlay={false}
            mode={undefined}
            paginationContainerStyleName={{
              marginTop: 16,
              ...(isRTLDirection && { flexDirection: "row-reverse" }),
            }}
            carouselWidth={width - 36}
            loop={false}
            renderItem={renderBigCard}
            containerClassName={`${isMinimized ? "" : "p-4"} bg-secondary-white rounded-2xl`}
          />
        </Animated.View>
      </>
    );
  }, [
    currentPackages,
    intialPackageIndex,
    progress,
    selectePackageIndex,
    handleCardPress,
    currentSelectedPackage?.sku,
    animatedOpacity,
    isMinimized,
  ]);

  const knowMore = useMemo(() => {
    const handleTermsConditions = () => {
      if (
        currentSelectedPackage &&
        getPackageType(currentSelectedPackage) === PACKAGE_TYPE.HOME_PKG
      ) {
        openBottomSheet("genericInfoSheet", {
          snapPoints: ["80%"],
          props: {
            title: t("action.termsConditions2"),
            options: [
              t("common.homePackageTnC1"),
              t("common.homePackageTnC2"),
              t("common.homePackageTnC3"),
              t("common.homePackageTnC4"),
            ],
            listSeparator: <View className="h-4" />,
            primaryButtonText: t("button.close"),
            primaryButtonPress: () => {
              setActiveSheet(null);
            },
          },
        });
      } else {
        navigation.navigate("StoreWebView", {
          title: t("common.packageDetail").replace(
            "{packageName}",
            currentSelectedPackage?.sku ?? "",
          ),
          url: "https://mediaprods3.maanaginx.com/media/package-pdf/Voice-Package/voice_New_Package_Card_1x-Eng.pdf",
        });
      }
    };
    return (
      <View className="bg-secondary-white rounded-2xl">
        <Section
          label={t("label.knowMore")}
          labelClassName="!text-lg"
          isCollapsible
        >
          {currentSelectedPackage &&
          getPackageType(currentSelectedPackage) !== PACKAGE_TYPE.HOME_PKG ? (
            <SectionItem
              leadingIcon="explore"
              label={t("action.exploreAddons")}
              showSperator
              containerClassName="mt-2"
              onPress={openExplorAddonSheet}
            />
          ) : null}

          <SectionItem
            leadingIcon="faq"
            label={t("label.faq")}
            showSperator
            onPress={openFaqBottomSheet}
          />
          <SectionItem
            leadingIcon="terms"
            label={t("action.termsConditions")}
            onPress={handleTermsConditions}
            containerClassName="pb-0"
          />
        </Section>
      </View>
    );
  }, [
    openFaqBottomSheet,
    currentSelectedPackage,
    navigation,
    openExplorAddonSheet,
    openBottomSheet,
    setActiveSheet,
  ]);

  const customFooter = useMemo(() => {
    const selectedPackage = currentSelectedPackage;
    if (!selectedPackage) return null;
    return (
      <CustomFooter containerClassName="pb-10">
        <View className="flex-1 flex-row gap-2 px-2 items-center">
          <View className="flex-grow">
            <PriceWithCurrencey
              price={
                simType === SIM_TYPE.ESIM
                  ? selectedPackage?.esimPackage?.price ||
                    selectedPackage?.price
                  : selectedPackage?.price
              }
              customTextClassName={`font-primary-bold text-secondary-green text-[24px]`}
              customDecimalTextClassName={"text-lg"}
              bgColor={Colors[theme].secondaryGreen}
              width={21}
              height={24}
            />
            <CustomText
              className={`font-primary-regular text-sm text-shades-gray-04 ${
                Platform.OS === "web" ? "text-start" : "text-left"
              }`}
            >
              {t("label.vatIncluded")}
            </CustomText>
          </View>
          <View>
            <CustomButton
              // containerClassName="!px-20 !py-2"
              label={t("button.buy")}
              onPress={handleBuyButton}
            />
          </View>
        </View>
      </CustomFooter>
    );
  }, [currentSelectedPackage, theme, handleBuyButton, simType]);

  return (
    <View className="flex-1">
      <View className="flex-1 p-5">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-[120px] gap-5"
        >
          {currentPackages?.length > 0 && (
            <Animated.View
              className="bg-secondary-white p-4 rounded-2xl"
              style={animatedStyle}
            >
              {/* <CustomText
								className={`text-lg text-secondary-gray ${Platform.OS === 'web' ? 'text-start' : 'text-left'} ${fontPrimaryBold}`}
							>
								{strings('label.packages')}
							</CustomText> */}
              {isVisitPackage(currentSelectedPackage?.sku ?? "") && (
                <InfoPill
                  texts={t("label.visitorPackageInfo")}
                  textClassName={`font-primary-regular !text-xs !text-shades-gray-01 flex-1 text-left text-start`}
                  mainContainerClassName={
                    "bg-shades-purple-06 items-center gap-x-3 mb-2 py-[6px] px-3"
                  }
                  leading={
                    <SVGIcon
                      name={"info"}
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                    />
                  }
                />
              )}
              {memoizedCarousel}
            </Animated.View>
          )}

          {selectePackageIndex !== null ? (
            <>
              <FeatureList
                id={currentSelectedPackage?.id + category?.name}
                currentSelectedPackage={currentSelectedPackage}
                features={
                  simType === SIM_TYPE.ESIM
                    ? (currentSelectedPackage?.esimPackage?.features ??
                      currentSelectedPackage?.features ??
                      [])
                    : (currentSelectedPackage?.features ?? [])
                }
                unlimetedApps={unlimetedApps ?? []} // adjust if needed
                paymentoptions={installmentMethods}
                category={category}
                banners={
                  simType === SIM_TYPE.ESIM
                    ? (currentSelectedPackage?.esimPackage?.banner ??
                      currentSelectedPackage?.banner ??
                      [])
                    : (currentSelectedPackage?.banner ?? [])
                }
              />

              {currentSelectedPackage &&
              getPackageType(currentSelectedPackage) ===
                PACKAGE_TYPE.HOME_PKG ? (
                <>
                  <ProductOptions />
                  <Section label={t("label.routerSpecification")} isCollapsible>
                    <CustomText
                      fontVarient="regular"
                      className="text-sm text-shades-gray-01 py-4"
                    >
                      The Zain 5G Router gives you next-generation home internet
                      with faster download speeds, stronger Wi-Fi coverage, and
                      a stable connection for all your smart devices. Perfect
                      for homes, offices, and entertainment-heavy users.
                    </CustomText>

                    <View className="gap-4">
                      <CustomText
                        fontVarient="bold"
                        className="text-xl text-secondary-gray text-left"
                      >
                        {t("label.productDetails")}
                      </CustomText>
                      <Table data={productData} />
                    </View>
                  </Section>
                </>
              ) : null}
              <PackageOffers
                coupons={coupons}
                onCouponApplied={(c) => console.log(c)}
              />
              {knowMore}
            </>
          ) : null}
        </ScrollView>
      </View>
      <Animated.View style={animatedOpacity}>{customFooter}</Animated.View>
    </View>
  );
};

export default React.memo(
  PackageDetails,
  (prev, next) =>
    prev.category === next.category &&
    prev.intialPackageIndex === next.intialPackageIndex,
);
