import { StackActions, useNavigation } from "@react-navigation/native";
import { useUserModeQuery } from "../../apis/services/dashboard";
import { usePackageCartMutation } from "../../apis/services/telcoProvision";
import {
  parsePackagesList,
  useDeviceListQuery,
  useGetPackagesQuery,
} from "../../apis/services/store";
import ActonCardsSection from "../../components/actionCardsSection";
import AcrivateSimCard from "../../components/activateSimCard";
import Banners from "../../components/banners";
import ContinuePaymentCard from "../../components/continuePaymentCard";
import CustomCarousel from "../../components/customCarousel";
import CustomHeader from "../../components/customHeader";
import CustomText from "../../components/customText";
import FadeOnFocusView from "../../components/fadeOnFocusView";
import GenericImage from "../../components/image";
import InfoCard from "../../components/infoCard";
import InfoPill from "../../components/infoPill";
import Loader from "../../components/loader";
// import RenewalOfferComponent from '../../components/renewalOfferBanner';
import Section from "../../components/section";
import SectionItem from "../../components/sectionItem";
import SmallStoreCard from "../../components/smallStoreCard";
import SVGIcon from "../../components/svgIcon";
import TrackOrActivateSimCard from "../../components/trackOrActivateSimCard";
import constants from "../../configs/constants";
import { GradientColors } from "../../configs/themes";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { ActivateSimSheetProps } from "../../sheets/activateSIMSheet";
import {
  BottomSheetOptions,
  useBottomSheetStore,
} from "../../stores/useBottomSheetStore";
import { userJourneyStore } from "../../stores/userJourneyStore";
import { useUserPreferenceStore } from "../../stores/userPreferencesStore";
import { useUpcomingFeatureStore } from "../../stores/useUpcomingFeatureStore";
import {
  FIRST_PACKAGE_STATUS,
  HOME_CARDS_ACTION,
  ONBOARDING_JOURNEY_TYPES,
  SEMATI_ERROR_CODES,
  SIM_TYPE,
  TOP_BANNER_USER_MODE,
} from "../../types";
import { isRTL } from "../../utils/formatter";
import { checkSimatiError, closeSheetModal, decodeJWT } from "../../utils/util";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  InteractionManager,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { useStepProgressStore } from "../../stores/useStepProgressStore";
import { generateTWKToken } from "../../helpers/twkHelper";
import { useVerifyTWKToken } from "../../apis/services/authentication";
import { useProfile } from "../../apis/services/user";

interface AdOnsType {
  title: string;
  tag: string;
  image: string;
  data?: string;
  unit?: string;
  amount?: number;
  subtitle?: string;
  sku?: string;
  tagBgColor?: string;
}

const adons: AdOnsType[] = [
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/explore-add-on.png"),
    tagBgColor: "bg-secondary-green",
  },
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/explore-add-on.png"),
    tagBgColor: "bg-secondary-green",
  },
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    subtitle: "Digital Card",
    amount: 0,
    image: require("../../../public/images/demo/explore-add-on.png"),
    tagBgColor: "bg-secondary-green",
  },
];

const gifts: AdOnsType[] = [
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/gift.png"),
    tagBgColor: "bg-secondary-green",
  },
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/gift.png"),
    tagBgColor: "bg-secondary-green",
  },
  {
    title: "International Calls",
    tag: "common.newFeature",
    data: "300",
    unit: "common.mins",
    subtitle: "Digital Card",
    amount: 0,
    image: require("../../../public/images/demo/gift.png"),
    tagBgColor: "bg-secondary-green",
  },
];

const eVochers: AdOnsType[] = [
  {
    title: "Netflix eVoucher",
    tag: "common.newLaunch",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/netflix.png"),
    tagBgColor: "bg-secondary-yellow",
  },
  {
    title: "Netflix eVoucher",
    tag: "common.newLaunch",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/netflix.png"),
    tagBgColor: "bg-secondary-yellow",
  },
  {
    title: "Netflix eVoucher",
    tag: "common.newLaunch",
    amount: 90.0,
    subtitle: "Digital Card",
    image: require("../../../public/images/demo/netflix.png"),
    tagBgColor: "bg-secondary-yellow",
  },
];
const freeCards: AdOnsType[] = [
  {
    title: "Happy Birthday",
    tag: "common.newLaunch",
    subtitle: "Gift Card",
    image: require("../../../public/images/demo/hb-gift.png"),
    tagBgColor: "bg-secondary-yellow",
  },
  {
    title: "Happy Birthday",
    tag: "common.newLaunch",
    subtitle: "Gift Card",
    image: require("../../../public/images/demo/hb-gift.png"),
    tagBgColor: "bg-secondary-yellow",
  },
  {
    title: "Happy Birthday",
    tag: "common.newLaunch",
    subtitle: "Gift Card",
    image: require("../../../public/images/demo/hb-gift.png"),
    tagBgColor: "bg-secondary-yellow",
  },
];

interface CustomCarouselType<T> {
  itemKey: string;
  label: string;
  data: T[];
  showCustomSubTitle?: boolean;
  //tagBGColor: string;
  imageContainerClassname: string;
  imageBGColor: string;
  imageWidth?: string;
  cardAction?: () => void;
}
const CAROUSEL_WIDTH = Dimensions.get("window").width - 64;

const CustomCarouselListSection = <T extends Record<string, any>>({
  itemKey,
  label,
  data,
  showCustomSubTitle = false,
  //tagBGColor,
  imageContainerClassname,
  imageBGColor,
  imageWidth,
  cardAction,
}: CustomCarouselType<T>): React.ReactElement => {
  const { t } = useAppTranslation();
  const navigation = useNavigation();
  return (
    <Section
      label={t(label)}
      containerClassName="mt-6"
      shouldShowAllAction
      allAction={cardAction}
    >
      <CustomCarousel<T>
        containerClassName="mt-4"
        data={isRTL() ? data.reverse() : data}
        scrollToSelectedItemOnInit={isRTL()}
        initialIndex={isRTL() ? data.length - 1 : 0}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              //TODO: stack required
              itemKey === "devices"
                ? navigation.navigate("DeviceDetails", {
                  sku: item?.sku,
                  name: item.title,
                })
                : undefined;
            }}
          >
            <SmallStoreCard
              withTag={!!item?.tag}
              tagText={t(item.tag)}
              uri={item.image}
              title={item.title}
              price={item.amount}
              subTitle={item.subtitle}
              imageContainerClassname={imageContainerClassname}
              imageHeight="h-[84px]"
              imageWidth={imageWidth || "w-[74px]"}
              imageBGColor={imageBGColor}
              tagBGColor={item?.tagBGColor}
              customeSubtitle={
                showCustomSubTitle ? (
                  <View className="flex-row items-center gap-2">
                    <SVGIcon
                      name={"phone"}
                      height={16}
                      width={16}
                      viewBox="0 0 16 16"
                    />
                    <InfoPill
                      texts={[
                        {
                          text: item.data,
                          weight: "bold",
                        },
                        { text: t(item.unit), textClassName: "!text-xs" },
                      ]}
                      mainContainerClassName="!py-0 !px-0 items-baseline"
                    />
                  </View>
                ) : undefined
              }
            />
          </Pressable>
        )}
        autoPlay={false}
        mode={undefined}
        loop={false}
        onItemPress={(index) => console.log("Item Pressed", index)}
        autoPlayReverse={isRTL()}
        width={180}
        carouselType="Packages"
        paginationContainerStyleName={{
          marginTop: 16,
          ...(isRTL() ? { flexDirection: "row-reverse" } : ""),
        }}
        carouselWidth={CAROUSEL_WIDTH}
        height={222}
      />
    </Section>
  );
};

const WelcomeSection = () => {
  const setActiveSheet = useBottomSheetStore((state) => state.setActiveSheet);
  const { setJourneyState, resetJourneyState } = userJourneyStore();
  const { t } = useAppTranslation();
  const navigation = useNavigation();
  const { setTotalSteps } = useStepProgressStore();

  const handleStartSimOrder = () => {
    resetJourneyState();
    setJourneyState({ journeyStartedFrom: "Store" });
    setActiveSheet("startSimOrderSheet", {
      props: {
        onOrderJourneyStart: closeSheetModal,
      },
      snapPoints: ["85%"],
    });
  };
  const handleSwtichNumber = () => {
    resetJourneyState();
    setJourneyState({ journeyStartedFrom: "Store" });
    setActiveSheet("startSwitchNumberSheet", {
      props: {
        onSwitchNumberJourneyStart: closeSheetModal,
      },
      snapPoints: ["85%"],
    });
  };

  const goToEsimOrder = () => {
    closeSheetModal();
    setTotalSteps(5);
    setJourneyState({
      journeyName: "ORDER_SIM",
      simType: SIM_TYPE.ESIM,
    });

    InteractionManager.runAfterInteractions(() => {
      // if (!isPackageSelected) {
      navigation.navigate("packages", {
        title: t("label.orderESIM"),
      });
      // } else {
      //TODO: create stack
      // navigation.navigate("personalInformation", {
      //   title: t("label.orderESIM"),
      // });
      // }
    });
  }
  return (
    <Section label={t("label.welcomeToYaqoot")} containerClassName="gap-4">
      <View className="gap-4">
        <View className="flex-row gap-4">
          <View className="border border-shades-purple-06 rounded-xl px-3 flex-1">
            <SectionItem
              iconWidth={40}
              iconHeight={40}
              leadingIcon={require("../../../public/images/order-sim-store.webp")}
              label={t("action.orderESIM")}
              labelClassName={`font-primary-medium text-sm `}
              containerClassName="flex-col !items-start justify-center !py-3"
              onPress={goToEsimOrder}
              showFallabackArrow={false}
            />
          </View>
          {/* <View className="border border-shades-purple-06 rounded-xl px-3 flex-1">
            <SectionItem
              iconHeight={40}
              iconWidth={40}
              leadingIcon={require("../../../public/images/change-sim.webp")}
              label={t("action.transferYaqoot")}
              labelClassName={`font-primary-medium text-sm`}
              containerClassName="flex-col !items-start !py-3"
              onPress={handleSwtichNumber}
              showFallabackArrow={false}
            />
          </View> */}
        </View>
        <View className="flex-row items-center border border-shades-border-02 rounded-xl px-1 py-1 gap-1">
          <View className="items-center justify-center">
            <GenericImage
              uri={require("../../../public/images/already-have-sim.webp")}
              width="w-[48px]"
              height="h-[40px]"
              resizeMode="contain"
            />
          </View>
          <CustomText
            className={`text-sm text-shades-gray-02 ps-2 font-primary-regular`}
          >
            {t("common.youHaveSIM")}
          </CustomText>
          <CustomText
            className={`text-sm text-secondary-blue ps-1 font-primary-medium`}
          >
            {t("common.activateNow")}
          </CustomText>
          <GenericImage
            height="h-[24px]"
            width="w-[24px]"
            uri={require("../../../public/images/arrow-right.webp")}
          />
        </View>
      </View>
    </Section>
  );
};

const PackagesSection = () => {
  const { theme, userType } = useUserPreferenceStore();
  const navigation = useNavigation();
  const { userTypes } = constants;
  const { resetJourneyState } = userJourneyStore();
  const { t } = useAppTranslation();
  const showUpcomingFeature = useUpcomingFeatureStore((s) => s.show);

  const handleInfoCardPress = () => {
    resetJourneyState();
    //TODO: stack required
    navigation.navigate("Packages");
  };

  const handleUpcomingFeaturePress = () => {
    showUpcomingFeature();
  };

  return (
    <Section
      label={t("label.packages")}
      containerClassName={`${userType !== userTypes.telco && "mt-6"}`}
    >
      <View>
        <View className={"flex-row pt-4 gap-x-4"}>
          <InfoCard
            icon={"call"}
            title={t("common.voicePackages")}
            onPress={handleInfoCardPress}
            mainContainerClassName="flex-1"
            colors={[
              GradientColors.rubyGradient[theme].secondryRuby,
              GradientColors.rubyGradient[theme].secondryRuby02,
            ]}
            titleClassName="text-secondary-white"
            iconContainerClassName="bg-secondary-white/10"
            locations={[0.6, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            backGroundImage={require("../../../public/images/bg-patterns/home.webp")}
          />
          <InfoCard
            icon={"dataPackage"}
            title={t("common.dataPackages")}
            onPress={handleUpcomingFeaturePress}
            mainContainerClassName="flex-1"
            colors={[
              GradientColors.purpleGradient[theme].secondryPurple,
              GradientColors.purpleGradient[theme].shadePurple01,
            ]}
            titleClassName="text-secondary-white"
            iconContainerClassName="bg-secondary-white/10"
            locations={[0.6, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            backGroundImage={require("../../../public/images/bg-patterns/data.webp")}
          />
        </View>
        <View className="flex-row pt-4 gap-x-4">
          <InfoCard
            icon={"internationalPackage"}
            title={t("common.visitPackages")}
            onPress={handleUpcomingFeaturePress}
            mainContainerClassName="flex-1"
            colors={[
              GradientColors.blueGradient[theme].secondryBlue,
              GradientColors.blueGradient[theme].shadesBlue02,
            ]}
            titleClassName="text-secondary-white"
            iconContainerClassName="bg-secondary-white/10"
            locations={[0.6, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            backGroundImage={require("../../../public/images/bg-patterns/voice.webp")}
          />
          <InfoCard
            icon={"bundlePackage"}
            title={t("common.homePackages")}
            onPress={handleUpcomingFeaturePress}
            mainContainerClassName="flex-1"
            colors={[
              GradientColors.greenGradient[theme].secondryGreen,
              GradientColors.greenGradient[theme].shadeGreen02,
            ]}
            titleClassName="text-secondary-white"
            iconContainerClassName="bg-secondary-white/10"
            locations={[0.6, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            backGroundImage={require("../../../public/images/bg-patterns/home.webp")}
          />
        </View>
        <View className="flex-row pt-4 gap-x-4">
          <InfoCard
            icon={"internationalPackage"}
            title={t("common.roamingInternational")}
            onPress={handleInfoCardPress}
            mainContainerClassName="flex-1"
            containerClassName="flex-row items-center gap-6"
            colors={[
              GradientColors.yellowGradient[theme].secondryYellow,
              GradientColors.yellowGradient[theme].shadesYellow02,
            ]}
            titleClassName="text-secondary-white flex-1 flex-grow !mt-0"
            iconContainerClassName="bg-secondary-white/10"
            locations={[0.6, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            backGroundImage={require("../../../public/images/bg-patterns/voice.webp")}
          />
        </View>
      </View>
    </Section>
  );
};

interface ListItemType {
  key: string;
  type: string;
  label?: string;
  showSub?: boolean;
  url?: string;
}

const listItems: ListItemType[] = [
  { key: "trackOrActivate", type: "TRACKORACTIVATESIM" },
  { key: "activateEsim", type: "ACTIVATE_ESIM" },
  { key: "continuePayment", type: "PAYMENT" },
  { key: "welcome", type: "WELCOME" },
  { key: "renewalOffer", type: "RENEWALOFFER" },
  { key: "actionCards", type: "ACTIONS" },
  { key: "packages", type: "PACKAGES" },
  { key: "addons", type: "CAROUSEL", label: "label.addOns", showSub: true },
  {
    key: "devices",
    type: "CAROUSEL",
    label: "label.devices",
    url: "store/devices",
  },
  { key: "gifts", type: "CAROUSEL", label: "label.gifts", showSub: true },
  { key: "eVouchers", type: "CAROUSEL", label: "label.eVouchers" },
  { key: "freeCards", type: "CAROUSEL", label: "label.freeCards" },
];

const StoreScreen = () => {
  const { data: packages } = useGetPackagesQuery();
  const { data: deviceListData, isLoading: isDeviceLoading } =
    useDeviceListQuery();
  const { userType, theme, updateUserPreferences, isTWKTokenValid } = useUserPreferenceStore();
  const {
    userTypes,
    collapsableHeaderHeight,
    tabScreenBottomPadding,
    paymentFor,
  } = constants;
  const { setActiveSheet } = useBottomSheetStore();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [headerHeight, setHeaderHeight] = useState(100);
  const [refreshing, setRefreshing] = useState(false);

  const { setJourneyState } = userJourneyStore();
  const { mutateAsync: packageCartMutation, isPending: packageCartLoading } = usePackageCartMutation();
  const { t } = useAppTranslation();
  const twkToken = generateTWKToken();
  const { mutateAsync: verifyTwkToken } = useVerifyTWKToken(twkToken);

  const navigation = useNavigation();

  const { data: userModeData, refetch: refetchUserMode } = useUserModeQuery();
  const {mutateAsync: fetchProfle,  data: userProfileData} = useProfile();
  const actions = userModeData?.actions ?? [];

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, collapsableHeaderHeight],
    outputRange: [0, -collapsableHeaderHeight + headerHeight],
    extrapolate: "clamp",
  });

  const showTrackOrActivateCard =
    userType === "NON_TELCO" &&
    actions?.find(
      (act) => act.key === HOME_CARDS_ACTION.SIM_DELIVERY_IN_PROGRESS,
    ) &&
    (userModeData?.topBanner?.key === HOME_CARDS_ACTION.ACTIVATE_SIM ||
      userModeData?.topBanner?.key === HOME_CARDS_ACTION.ACTIVATE_MNP_SIM);

  const showActivateSim =
    userType === "NON_TELCO" &&
    (userModeData?.topBanner?.key === HOME_CARDS_ACTION.ACTIVATE_SIM ||
      userModeData?.topBanner?.key === HOME_CARDS_ACTION.ACTIVATE_MNP_SIM);

  const showContinueToPayment =
    userType === "NON_TELCO" &&
    userModeData?.topBanner?.key === TOP_BANNER_USER_MODE.PAY_YOUR_PACKAGE;

  const fetchData = (key: string) => {
    switch (key) {
      case "devices":
        return {
          // data: devices,
          data:
            deviceListData?.product?.slice(0, 3)?.map((device) => {
              return {
                image: device?.thumbnail_image,
                title: device?.name,
                amount: Number(device?.starting_price) ?? 0,
                subtitle: device?.brand_name,
                sku: device?.sku,
                tag: device?.product_tag?.title,
                tagBgColor: device?.product_tag?.color, //'bg-secondary-yellow',
              } as AdOnsType;
            }) ?? [],
          imageContainerClassname: "bg-secondary-white",
          imageBGColor: "#FFFFFF",
          imageWidth: "w-[140px]",
        };
      case "gifts":
        return {
          data: gifts,

          imageContainerClassname: "bg-shades-blue-06",
          imageBGColor: "#E5F4F8",
        };
      case "eVouchers":
        return {
          data: eVochers,
          imageContainerClassname: "rgb(0, 0, 0)",
          imageBGColor: "#000000",
        };
      case "freeCards":
        return {
          data: freeCards,
          imageContainerClassname: "rgba(207, 228, 215, 1)",
          imageBGColor: "#CFE4D7",
        };
      default:
        return {
          data: adons,
          imageContainerClassname: "bg-shades-yellow-06",
          imageBGColor: "#FFF1DA",
        };
    }
  };

  // useEffect(()=>{
  //     verifyTwkToken({
  //       full_name: "محمد عبدالعزيز",
  //       mobile_number: "+966533978938",
  //       email: "sam070120361@example.com",
  //       language: "en"
  //     }).then((res) => {
  //       console.log("TWK Token verification response", res);
  //       if(res?.token){
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: res.token})
  //         refetchUserMode();
  //         const decoded = decodeJWT(res.token);
  //         console.log("Decoded TWK Token", decoded);
  //         if(decoded?.user?.id){
  //         fetchProfle({userId: decoded?.user?.id}).then((res) => {
  //           updateUserPreferences({userId: decoded?.user?.id, name: res?.name, emailId: res?.emailId, phoneNumber: res?.phoneNo})
  //           console.log("User profile data", res);
  //         })
  //         }
  //       }
  //       else {
  //         // Temp to complete the implementation, Add the working bearer token here to test the flow until the TWK token is working from backend 
  
  //         // updateUserPreferences({isTWKTokenValid: false, accessToken: null})
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjVjZTQwMTAtMzAxNy0xMWYxLTgxMDEtODVmZDgwY2QwMDgyIiwibmFtZSI6InJlZmVycnIiLCJpc011bHRpbGluZSI6dHJ1ZX0sImlhdCI6MTc3NTM2OTY5MywiZXhwIjoxNzgwNTUzNjkzfQ.kXhtxjOfymGK2ROhcDb3B8BGkLNxy1NCPIkXGRrmjiU'})
  //       }
  //     }).catch((err) => {
  //       console.log("TWK Token verification failed", err);
  //               // Temp to complete the implementation, Add the working bearer token here to test the flow until the TWK token is working from backend
  
  //       // updateUserPreferences({isTWKTokenValid: false, accessToken: null})
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjVjZTQwMTAtMzAxNy0xMWYxLTgxMDEtODVmZDgwY2QwMDgyIiwibmFtZSI6InJlZmVycnIiLCJpc011bHRpbGluZSI6dHJ1ZX0sImlhdCI6MTc3NTM2OTY5MywiZXhwIjoxNzgwNTUzNjkzfQ.kXhtxjOfymGK2ROhcDb3B8BGkLNxy1NCPIkXGRrmjiU'})
  
  //     });
  // }, [isTWKTokenValid, verifyTwkToken])

  const onTrackPress = () => {
    //TODO: stack required
    navigation.navigate("MyOrders");
  };

  const openBottomSheet = (key: string, options: BottomSheetOptions) => {
    setActiveSheet(key, options);
  };

  const onActivatePress = () => {
    if (
      userModeData?.actions?.find(
        (item) => item.key === HOME_CARDS_ACTION.ERR_SIMATI,
      )
    ) {
      handleErrSimati();
      return;
    }
    const sku =
      userModeData?.userMode?.firstPackageStatus ===
        FIRST_PACKAGE_STATUS.PENDING
        ? userModeData?.userMode?.firstPackageSku
        : "";
    const selectedPackage = parsePackagesList(packages?.packages || []).find(
      (item) => item.sku === sku,
    );
    const simType: SIM_TYPE =
      userModeData?.orderJourney?.orderType === ONBOARDING_JOURNEY_TYPES.NEW_SIM
        ? SIM_TYPE.PHYSICAL
        : SIM_TYPE.ESIM;

    const msisdn = userModeData?.orderJourney?.msisdn;
    const activateSimSheetProps: ActivateSimSheetProps = {
      verifyWith: userModeData?.userMode?.idValue ? "NATIONAL_ID" : "PASSPORT",
      simType,
      msisdn,
      idValue: userModeData?.userMode?.idValue,
      selectedPackage,
      msisdnTransitionType: userModeData?.orderJourney?.msisdnTransitionType,
    };

    if (simType === SIM_TYPE.ESIM) {
      openBottomSheet("activateESIMInfoSheet", {
        snapPoints: ["80%"],
        props: {
          msisdn,
          selectedPackage,
          onGotIt: () =>
            openBottomSheet("activateSimSheet", {
              props: activateSimSheetProps,
              snapPoints: ["65%"],
            }),
        },
      });
    } else {
      openBottomSheet("activateSimSheet", {
        props: activateSimSheetProps,
        snapPoints: ["65%"],
      });
    }
  };
  const handleActionPress = (key: string) => {
    // if (type === 'action.continuePayment') {
    // 	handlePaymentPending();
    // } else onActivatePress(SIM_TYPE.ESIM);
    if (key === TOP_BANNER_USER_MODE.PAY_YOUR_PACKAGE) {
      handlePaymentPending();
    } else if (
      key === HOME_CARDS_ACTION.ACTIVATE_SIM ||
      key === HOME_CARDS_ACTION.START_Z2Y_MIGRATION ||
      key === HOME_CARDS_ACTION.ACTIVATE_MNP_SIM
    ) {
      onActivatePress();
    } else if (key === HOME_CARDS_ACTION.MNP_IN_PROGRESS) {
      handleSwitchNumberInProgress();
    } else if (key === HOME_CARDS_ACTION.ERR_SIMATI) {
      handleErrSimati();
    } else if (key === HOME_CARDS_ACTION.SIM_DELIVERY_IN_PROGRESS) {
      //TODO: stack required
      navigation.navigate("MyOrders");
    }
  };

  const handleErrSimati = () => {
    const { newNumberMobileAlreadyExists } = checkSimatiError(
      userModeData?.orderJourney,
    );

    const sku =
      userModeData?.userMode?.firstPackageStatus ===
        FIRST_PACKAGE_STATUS.PENDING
        ? userModeData?.userMode?.firstPackageSku
        : "";
    const selectedPackage = parsePackagesList(packages?.packages || []).find(
      (item) => item.sku === sku,
    );

    setJourneyState({
      selectedPackage: selectedPackage,
    });
    if (
      userModeData?.orderJourney?.userMnpStatus?.simatiErrorCode ===
      SEMATI_ERROR_CODES.INVALID_SIM_NUMBER
    ) {
      //TODO design is not available
      alert("Invalid sim number");
    } else if (newNumberMobileAlreadyExists) {
      //TODO navigate to choose new number
    } else {
      //TODO: stack required
      navigation.navigate("InformationMismatch", {
        title:
          userModeData?.orderJourney?.orderType ===
            ONBOARDING_JOURNEY_TYPES.ESIM
            ? t("label.activateESIM")
            : t("common.activateSIM"),
        type: userModeData?.orderJourney?.userMnpStatus?.simatiErrorCode,
      });
    }
  };

  const handleSwitchNumberInProgress = () => {
    openBottomSheet("switchNumberRequestInProgressSheet", {
      props: {
        simOrderId: userModeData?.orderJourney.simOrderId,
        msisdnType: userModeData?.orderJourney?.msisdnTransitionType,
        orderJourney: userModeData?.orderJourney,
      },
      snapPoints: ["75%", "85%"],
    });
  };

  const handlePaymentPending = async () => {
    const sku =
      userModeData?.userMode?.firstPackageStatus ===
        FIRST_PACKAGE_STATUS.PENDING
        ? userModeData?.userMode?.firstPackageSku
        : "";
    // For eSIM: Save both msisdn and simType in the journey store.
    // The payment screen title will be based on the usermode  order type.
    // For physical SIM: Payment card appears after activation, so orderJourney won’t be available — only simType should be saved.
    const msisdn =
      userModeData?.orderJourney?.msisdn ||
      userModeData?.orderJourney?.requested_msisdn;

    const simType =
      userModeData?.orderJourney?.orderType === ONBOARDING_JOURNEY_TYPES.ESIM
        ? SIM_TYPE.ESIM
        : SIM_TYPE.PHYSICAL;

    setJourneyState({
      ...(msisdn && {
        selectedNumber: { msisdn, id: "", selected: true },
        idValue: userModeData?.userMode?.idValue,
        journeyName: "ORDER_SIM",
      }),
      simType,
    });

    try {
      const response = await packageCartMutation({ package_sku: sku || "" });
      navigation.dispatch(
        StackActions.replace("reviewPayment", {
          id: sku || "",
          type: paymentFor.orderSIM,
          title: t("label.orderESIM"),
          ...(response?.paymentLink && { paymentLink: response.paymentLink }),
        })
      );
    } catch {
      navigation.dispatch(
        StackActions.replace("reviewPayment", {
          id: sku || "",
          type: paymentFor.orderSIM,
          title: t("label.orderESIM"),
        })
      );
    }
  };
  const renderItem = (item: ListItemType) => {
    const itemInfo = fetchData(item.key);

    const handleRedirection = () => {
      if (item.url) {
        //TODO: stack required
        return navigation.navigate("Devices");
      }
    };

    switch (item.type) {
      case "WELCOME":
        return userType !== userTypes.telco &&
          !(
            showTrackOrActivateCard ||
            showActivateSim ||
            showContinueToPayment
          ) ? (
          <WelcomeSection />
        ) : null;
      case "ACTIONS":
        return userType === userTypes.nonTelco && actions?.length > 0 ? (
          <ActonCardsSection
            onActionPress={handleActionPress}
            actions={actions ?? []}
            orderJourney={userModeData?.orderJourney}
          />
        ) : null;
      case "PACKAGES":
        return <PackagesSection />;
      case "CAROUSEL":
        if (userType === userTypes.guest && item.label === t("label.addOns")) {
          return null;
        }
        return (
          <CustomCarouselListSection
            itemKey={item.key}
            label={item.label || ""}
            data={itemInfo.data}
            showCustomSubTitle={item.showSub}
            tagBGColor={itemInfo.tagBgColor}
            imageBGColor={itemInfo.imageBGColor}
            imageContainerClassname={itemInfo.imageContainerClassname}
            imageWidth={itemInfo.imageWidth}
            cardAction={handleRedirection}
          />
        );
      case "TRACKORACTIVATESIM":
        return showTrackOrActivateCard ? (
          <TrackOrActivateSimCard
            onTrackPress={onTrackPress}
            onActivatePress={onActivatePress}
          />
        ) : null;
      case "ACTIVATE_ESIM":
        return showActivateSim && !showTrackOrActivateCard ? (
          <AcrivateSimCard
            onActivatePress={onActivatePress}
            simType={
              userModeData?.orderJourney?.orderType ===
                ONBOARDING_JOURNEY_TYPES.NEW_SIM
                ? SIM_TYPE.PHYSICAL
                : SIM_TYPE.ESIM
            }
          />
        ) : null;

      case "PAYMENT":
        return showContinueToPayment ? (
          <ContinuePaymentCard onContinuePress={handlePaymentPending} />
        ) : null;
      default:
        return null;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    refetchUserMode().then(() => setRefreshing(false));
  };

  return (
    <FadeOnFocusView>
      <View className="flex-1 bg-shades-purple-06">
        <Animated.View
          style={{
            height: collapsableHeaderHeight,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          <LinearGradient
            colors={[
              GradientColors.rubyGradient[theme].primaryRuby,
              GradientColors.rubyGradient[theme].secondryRuby02,
            ]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 0 }}
            locations={[0.5, 1]}
            className="flex-1 rounded-b-[8px]"
          />
        </Animated.View>

        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}
          style={{ zIndex: 2 }}
        >
          <CustomHeader
            isTransparent
            trailingIcon={
              userType === userTypes.guest ? "search" : "notification"
            }
          />
        </View>

        <Animated.FlatList
          data={listItems}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{
            paddingBottom: tabScreenBottomPadding, // due to dyanmaic value
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          renderItem={({ item, index }) => (
            <View className={index === 0 ? "mt-8 mx-5" : "mx-5"}>
              {renderItem(item)}
            </View>
          )}
          ListHeaderComponent={
            <Banners
              onPress={(type) => {
                switch (type) {
                  case "mokafaa":
                    //TODO: stack required
                    navigation.navigate("MokafaaIntro");
                    break;
                  default:
                    break;
                }
              }}
              userMode={userModeData}
            />
          }
        />
        <Loader loading={isDeviceLoading || packageCartLoading} />
      </View>
    </FadeOnFocusView>
  );
};

export default StoreScreen;
