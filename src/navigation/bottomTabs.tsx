import * as React from "react";
import { Button, Dimensions, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useLanguageToggle } from "../hooks/useLanguageToggle";
import { useAppTranslation } from "../hooks/useAppTranslation";
import constants from "../configs/constants";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { Colors } from "../configs/themes";
import SVGIcon from "../components/svgIcon";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import CustomHeader from "../components/customHeader";
import CustomText from "../components/customText";
import StoreScreen from "../pages/store";

const Tab = createBottomTabNavigator();

function AboutScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>About Screen</Text>
      <Button onPress={() => navigation.goBack()} title="Go Back" />
    </View>
  );
}

function HomeScreen() {
  const { toggleLanguage } = useLanguageToggle();
  const { t } = useAppTranslation();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text className="text-primary-ruby bg-primary-creem p-4 font-primary-regular">
        Home Screen
      </Text>
      <Text className="text-primary-ruby bg-primary-creem p-4 font-primary-medium">
        الصفحة الرئيسية
      </Text>
      <Button
        onPress={async () => await toggleLanguage()}
        title="Change language"
      />
      {/* <Text className="text-primary-ruby bg-primary-creem p-4 font-primary-medium">
        lang
      </Text> */}
      <Text className="text-primary-ruby bg-primary-creem p-4 font-primary-medium">
        {t("appName")}
      </Text>
    </View>
  );
}

function TabBarIcon({
  name,
  width = 24,
  height = 24,
  isFocused = false,
  tabConfig,
}: {
  name: string;
  width?: number;
  height?: number;
  isFocused?: boolean;
  tabConfig?: any;
}) {
  const { t } = useAppTranslation();

  return (
    <View className={"flex-1 gap-[6px] items-center justify-center"}>
      <SVGIcon name={name} width={width} height={height} />
      <CustomText
        className={`${
          isFocused ? "text-secondary-gray" : "text-shades-gray-04"
        } font-primary-regular`}
      >
        {t(tabConfig?.title)}
      </CustomText>
    </View>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, userType } = useUserPreferenceStore();
  const { bottomTabHeight } = constants;
  const hiddenForNonTelcoGuest = ["index", "usage"];

  return (
    <View className="flex items-center bg-transparent">
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: bottomTabHeight,
          backgroundColor: "white",
          overflow: "visible",
          shadowColor: Colors[theme].black,
          shadowOpacity: 0.25,
          shadowRadius: 15,
          shadowOffset: { width: -10, height: 4 },
          elevation: 5,
        }}
      >
        {state.routes
          .filter(
            (route) =>
              userType === "TELCO" ||
              !hiddenForNonTelcoGuest.includes(route.name)
          )
          .map((route, index: number) => {
            const isFocused = state.index === index;

            const tabConfig = constants.tabs.find(
              (tab) => tab.name === route.name
            );
            if (!tabConfig) return null;

            const iconName = isFocused
              ? tabConfig.activeIcon
              : tabConfig.inActiveIcon;
            const iconSize = isFocused
              ? tabConfig.activeIconSize
              : tabConfig.inActiveIconSize;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: bottomTabHeight,
                }}
              >
                <TabBarIcon
                  name={iconName}
                  width={iconSize.width}
                  height={iconSize.height}
                  isFocused={isFocused}
                  tabConfig={tabConfig}
                />
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

export default function BottomTabs() {
  const { tabs, userTypes } = constants;
  const { userType } = useUserPreferenceStore();
  const { t } = useAppTranslation();
  const pathname = window.location.pathname;
  const currentTab = pathname?.split("/")?.pop() || "index";

  const trailingIcon =
    userType === userTypes.guest
      ? "search"
      : currentTab === "usage"
      ? "analytics"
      : "notification";

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        header: () => (
          <CustomHeader
            trailingIcon={trailingIcon}
            withBottomRadius
            onTrailingIconPress={() => {}}
          />
        ),
      }}
    >
      {tabs
        .filter((tab) => userType === userTypes.telco || !tab.telcoUserRequired)
        .map((tab) => (
          <Tab.Screen
            key={tab.name}
            component={StoreScreen}
            name={tab.name}
            options={{
              title: t(tab.title),
              headerShown: tab.showHeader,
            }}
          />
        ))}
    </Tab.Navigator>
  );
}
