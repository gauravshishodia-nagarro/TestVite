import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors, Themes } from "../configs/themes";
import BottomTabs from "./bottomTabs";
import LanguageSelection from "../pages/languageSelection";
import { useUserNavigationStore } from "../stores/userNavigationStore";
import CustomBottomSheet from "../components/bottomSheet";
import Packages from "../pages/store/packages";
import PersonalInformation from "../pages/store/personal-information";
import BasicHeader from "../components/basicHeader";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import constants from "../configs/constants";
import { formatPhone } from "../utils/formatter";
import CustomText from "../components/customText";
import ReviewOrder from "../pages/store/review-order";
import ReviewPayment from "../pages/payment/review-payment";
import ThreeDSecureView from "../pages/payment/three-d-secure";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { generateTWKToken, useAutoLogin } from "../helpers/twkHelper";

const Stack = createNativeStackNavigator();

const headerMap: Record<
  string,
  { titleKey: string; trailingIcon?: string; showLeadingIcon?: boolean }
> = {
  help: {
    titleKey: "label.helpCenter",
    showLeadingIcon: true,
  },
  accounts: {
    titleKey: "action.login",
    showLeadingIcon: true,
  },
  documentViewver: {
    titleKey: "title",
    showLeadingIcon: false,
  },
  analytics: {
    titleKey: "label.myUsageAnalytics",
  },
  "supported-countries": {
    titleKey: "label.supportingCountries",
  },
  manageSim: {
    titleKey: "label.managesim",
  },
  packages: {
    titleKey: "label.packages",
  },
  devices: {
    titleKey: "label.devices",
  },
  productDetails: {
    titleKey: "label.productDetails",
  },
  "addon-details": {
    titleKey: "label.addOnDetails",
  },
  chooseUnlimitedApps: {
    titleKey: "label.chooseUnlimitedApps",
  },
  changeApps: {
    titleKey: "label.changeApps",
  },
  setupAutoRenew: {
    titleKey: "common.setupAutoRenew",
  },
  changePaymentMethod: {
    titleKey: "common.changePaymentMethod",
  },
  addMoreApps: {
    titleKey: "label.addMoreApps",
  },
  faq: {
    titleKey: "label.faq",
  },
  "my-gift": {
    titleKey: "label.giftDetails",
  },
  payment: {
    titleKey: "title",
  },
  success: {
    titleKey: "",
  },
  "personalInformation": {
    titleKey: "action.orderSIM",
  },
  nafathVerification: {
    titleKey: "title",
  },
  deliveryInformation: {
    titleKey: "label.deliveryInformation",
  },
  reviewOrder: {
    titleKey: "title",
  },
  reviewPayment: {
    titleKey: "title",
  },
  nationalAddress: {
    titleKey: "title",
  },
  termsAndConditions: {
    titleKey: "title",
  },
  activationInProgress: {
    titleKey: "title",
  },
  activationEsimReady: {
    titleKey: "label.activateESIM",
  },
  activationEsimPair: {
    titleKey: "label.activateESIM",
  },
  updateDetails: {
    titleKey: "label.updateDetails",
  },
  activateSIM: {
    titleKey: "common.activateSIM",
  },
  scanSIM: {
    titleKey: "label.scanSIM",
  },
  error: {
    titleKey: "title",
  },
  orderPaymentSuccess: {
    titleKey: "title",
  },
  orderConfirmed: {
    titleKey: "title",
  },
  absherVerification: {
    titleKey: "title",
  },
  twoStepVerification: {
    titleKey: "label.twoStepVerification",
  },
  managePayments: {
    titleKey: "common.paymentManagement",
  },
  "my-orders": {
    titleKey: "action.myOrders",
  },
  viewDetails: {
    titleKey: "label.viewDetails",
  },
  mokafaaIntro: {
    titleKey: "",
  },
  installmentInfo: {
    titleKey: "label.installmentDetails",
  },
  tamamInfo: {
    titleKey: "label.installmentDetails",
  },
  managePaymentMethods: {
    titleKey: "label.managePaymentMethod",
  },
  walletTransactions: {
    titleKey: "label.wallet",
  },
  contactInformation: {
    titleKey: "title",
  },
  emailVerification: {
    titleKey: "action.verifyYourEmail",
  },
};

export const ShowHeader = ({
  routeName,
  titleFromParams,
  onTrailingPress,
  trailingIcon,
  leadingContainerClassName,
  containerClassName,
  trailingView,
}: {
  routeName: string;
  titleFromParams?: string;
  onTrailingPress?: () => void;
  trailingIcon?: string | undefined;
  trailingView?: React.ReactNode;
  trailingIconClassName?: string;
  leadingContainerClassName?: string;
  containerClassName?: string;
}) => {
  console.log("routeName", routeName);
  console.log("titleFromParams", titleFromParams);
  const { t } = useAppTranslation();
  const { phoneNumber } = useUserPreferenceStore();
  const { actionOpacity, animateOpacity } = constants;

  const { titleKey, showLeadingIcon } = headerMap[routeName];
  const manageSIMTitle = phoneNumber ? formatPhone(phoneNumber) : "";
  const title =
    routeName === "manageSim"
      ? manageSIMTitle
      : routeName === "success" ||
          routeName === "termsAndConditions" ||
          routeName === "mokafaaIntro"
        ? ""
        : (titleFromParams ?? t(titleKey));

  const isDocumentViewer = routeName === "documentViewver";

  return (
    <BasicHeader
      title={title}
      isTitleClickable={routeName === "manageSim"}
      showLeadingIcon={showLeadingIcon}
      trailingIcon={trailingIcon}
      leadingContainerClassName={leadingContainerClassName}
      containerClassName={containerClassName}
      trailingView={
        isDocumentViewer ? (
          <Pressable
            onPress={onTrailingPress}
            className={`${actionOpacity} ${animateOpacity}`}
          >
            <CustomText
              className={`text-secondary-blue text-base ${constants.fontPrimaryMedium}`}
            >
              {t("action.done")}
            </CustomText>
          </Pressable>
        ) : (
          trailingView
        )
      }
      onTrailingIconPress={onTrailingPress}
    />
  );
};

export default function RootStack() {
  const { login } = useAutoLogin();

  React.useEffect(() => {
    login(generateTWKToken(), {
      full_name: 'Tawakkalna User',
      mobile_number: '+966533978933',
      email: 'sdfjhsfkjsdhfkhdskfjk@sksk.com',
      language: 'en',
    });
  }, []);

  const { hasCompletedLanguageSelection } = useUserNavigationStore();
  const initialRouteName = hasCompletedLanguageSelection
    ? "tabs"
    : "languageSelection";

  return (
    <View
      style={[
        Themes["light"],
        StyleSheet.absoluteFill,
        { backgroundColor: Colors["light"].secondaryWhite },
      ]}
    >
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={"tabs"}
          component={BottomTabs}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name={"packages"}
          component={Packages}
          options={({ route }) => ({
            headerShown: true,
            header: () => (
              <ShowHeader
                routeName={route.name}
                titleFromParams={route.params?.title}
              />
            ),
          })}
        />
        <Stack.Screen
          name={"personalInformation"}
          component={PersonalInformation}
          options={({ route }) => ({
            headerShown: true,
            header: () => (
              <ShowHeader
                routeName={route.name}
                titleFromParams={route.params?.title}
              />
            ),
          })}
        />
        <Stack.Screen
          name={"reviewOrder"}
          component={ReviewOrder}
          options={({ route }) => ({
            headerShown: true,
            header: () => (
              <ShowHeader
                routeName={route.name}
                titleFromParams={route.params?.title}
              />
            ),
          })}
          />
          <Stack.Screen
          name={"reviewPayment"}
          component={ReviewPayment}
          options={({ route }) => ({
            headerShown: true,
            header: () => (
              <ShowHeader
                routeName={route.name}
                titleFromParams={route.params?.title}
              />
            ),
          })}
          />
        <Stack.Screen
          name={"languageSelection"}
          component={LanguageSelection}
        />
      <Stack.Screen
          name={"threeDSecureView"}
          component={ThreeDSecureView}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
      <CustomBottomSheet />
    </View>
  );
}
