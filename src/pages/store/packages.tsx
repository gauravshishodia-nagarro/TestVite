import { mutationKeys } from "../../apis/mutationKeys";
import {
  parsePackagesList,
  useGetPackagesQuery,
} from "../../apis/services/store";
import CustomText from "../../components/customText";
import Loader from "../../components/loader";
import PackageDetails from "../../components/packageDetails";
import SingleSelect from "../../components/singleSelect";
import constants from "../../configs/constants";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useStepProgressStore } from "../../stores/useStepProgressStore";
import { userJourneyStore } from "../../stores/userJourneyStore";
import { useUserNavigationStore } from "../../stores/userNavigationStore";
import { SIM_TYPE } from "../../types";
import { isRTL } from "../../utils/formatter";
import { useIsMutating } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  InteractionManager,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabView,
} from "react-native-tab-view";

export const PACKAGE_CATEGPORIES = [
  { id: 1, name: "All" },
  { id: 2, name: "Voice" },
  { id: 3, name: "Data" },
  { id: 4, name: "Visitors" },
  { id: 5, name: "Home" },
];

type SegmentFormatType = {
  bold: boolean;
  underline: boolean;
  italic: boolean;
  strike_through: boolean;
  hyper_link: string;
  color: string;
};

type SegmentType = {
  text: string;
  format: SegmentFormatType;
};

type FeatureType = {
  icon_path: string;
  segments: SegmentType[];
  showApps?: boolean;
};

export type PackagesType = {
  id: number;
  sku: string;
  package_logo_image: string;
  price: string;
  banner_text_color: string;
  banner_background_color: string;
  package_behavior: string;
  package_color: string;
  features: FeatureType[];
  package_image_width?: number;
  package_image_height?: number;
  package_logo_image_inactive?: string;
  package_color_gradient?: string[];
};

export const unlimetedApps: string[] = [
  require("../../../public/images/demo/telegram.png"),
  require("../../../public/images/demo/whatsapp.png"),
  require("../../../public/images/demo/insta.png"),
  require("../../../public/images/demo/snapchat.png"),
  require("../../../public/images/demo/shahid.png"),
  require("../../../public/images/demo/netflix.png"),
  require("../../../public/images/demo/sound-cloud.png"),
  require("../../../public/images/demo/twitter.png"),
  require("../../../public/images/demo/anghami.png"),
  require("../../../public/images/demo/osm.png"),
  require("../../../public/images/demo/facebook.png"),
  require("../../../public/images/demo/youtube.png"),
  require("../../../public/images/demo/twicth.png"),
  require("../../../public/images/demo/starzplay.png"),
  require("../../../public/images/demo/jaco.png"),
  require("../../../public/images/demo/playhere.png"),
];

const Packages: React.FC = ({ route }) => {
  const layout = useWindowDimensions();
  const { t } = useAppTranslation();
  const { identifier } = route.params;
  const [intialPackageIndex, setIntialPackageIndex] = useState(0);
  const { setNavigationState } = useUserNavigationStore();
  const { journeyName, setJourneyState, simType } = userJourneyStore();
  const { fontPrimaryBold } = constants;
  const { totalSteps, setTotalSteps, setProgress } = useStepProgressStore();
  const { isLoading, refetch, data: packages } = useGetPackagesQuery();
  const isSimOrderPackageInfoMutating =
    useIsMutating({ mutationKey: [mutationKeys.simOrderPackageInfo] }) > 0;
  const categories = packages?.store_categories ?? [];
  const packagesList = packages?.packages ?? [];

  const getCategoryIndex = () => {
    if (categories?.length === 0) {
      return 0;
    }
    const categoryIndex = categories?.findIndex((item) => {
      return item.name.includes(identifier?.toString());
    });

    const selectedCategoryIndex = categoryIndex > 1 ? categoryIndex - 1 : 0;
    return selectedCategoryIndex;
  };

  const [index, setIndex] = useState(getCategoryIndex());

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (journeyName && totalSteps > 4) {
      setProgress(1, 5);
    }
  }, [setProgress, totalSteps, journeyName]);

  useEffect(() => {
    if (packagesList?.length === 0 || categories?.length === 0) {
      return;
    }
  }, [setJourneyState, setTotalSteps, categories, packagesList]);

  useEffect(() => {
    if (identifier) {
      const selectedCtegoryIndex = getCategoryIndex();
      setIndex((prevIndex) =>
        prevIndex !== selectedCtegoryIndex ? selectedCtegoryIndex : prevIndex,
      );
    }
  }, [identifier, categories]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setNavigationState({ packageTabIndex: index });
      });
    });
  }, [index, setNavigationState]);

  // Create dynamic routes
  const routes = useMemo(() => {
    //TODO:removing 1st index, this should be taken care on BE
    const routeCategories = categories.slice(1);
    return routeCategories.map((category) => ({
      key: category?.name?.toLowerCase(), // e.g., 'voice'
      title: category?.name, // Displayed on tab bar
    }));
  }, [categories]);

  // Create dynamic scene mapping
  const renderScene = useMemo(() => {
    const scenes: Record<string, React.ComponentType> = {};
    for (const category of categories) {
      const key = category?.name.toLowerCase();
      scenes[key] = () => (
        <PackageDetails
          category={category}
          intialPackageIndex={intialPackageIndex}
          showSmallCard={false}
        />
      );
    }
    return SceneMap(scenes);
  }, [intialPackageIndex, categories]);

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<Route> },
  ) => {
    const titles = props.navigationState.routes
      .map((route) => route.title)
      .filter((title): title is string => typeof title === "string");

    // Use index from TabView’s navigationState
    const selected =
      props.navigationState.routes[props.navigationState.index]?.title ||
      titles[0] ||
      "";

    const handlePackageCategoryOnSelect = (title: string) => {
      setIntialPackageIndex(0);
      const selectedRoute = props.navigationState.routes.find(
        (route) => route.title === title,
      );
      if (selectedRoute) {
        props.jumpTo(selectedRoute.key);
      }
    };

    return (
      <View className="ml-5 mt-5">
        <SingleSelect
          data={titles}
          selected={selected}
          onSelect={handlePackageCategoryOnSelect}
          horizontal={true}
        />
      </View>
    );
  };

  // Only render TabView when we have width and categories
  const isReady = layout.width > 0 && categories.length > 0;

  if (!isReady) return <Loader loading={isLoading} />;
  return (
    <View className="flex-1 mt-6">
      {journeyName && totalSteps > 4 && (
        <View className="mx-5 ">
          <CustomText
            className={`text-secondary-gray text-lg ${Platform.OS === "web" ? "text-start" : "text-left"} ${fontPrimaryBold}`}
          >
            {t("label.chooseYourPackage")}
          </CustomText>
          <CustomText
            fontVarient="regular"
            className="text-shades-gray-02 text-sm"
          >
            {t("common.selectPackageChoice").replace(
              "{type}",
              simType === SIM_TYPE.ESIM ? t("label.esim") : t("label.sim"),
            )}
          </CustomText>
        </View>
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={false}
        animationEnabled
        renderTabBar={renderTabBar}
        direction={isRTL() ? "rtl" : "ltr"}
      />
      <Loader loading={isSimOrderPackageInfoMutating} />
    </View>
  );
};

export default Packages;
