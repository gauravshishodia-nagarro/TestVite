import { Alert, Platform } from "react-native";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import i18n from "../utils/i18n";
import { resetAndNavigate } from "../utils/util";
import { useNavigation } from "@react-navigation/native";

let isErrorAlertVisible = false;

export const useResetSessionAndNavigate = () => {
  const navigation = useNavigation();

  const resetSessionAndNavigate = () => {
    useUserPreferenceStore.getState().resetUserPreferences();

    resetAndNavigate(navigation, "Auth", {
      hideBackIcon: true,
    });
  };

  return { resetSessionAndNavigate };
};

const releaseAlertLock = (delay = 1000) => {
  setTimeout(() => {
    isErrorAlertVisible = false;
  }, delay);
};

export const showGlobalError = (message: string, statusCode: number) => {
  const { resetSessionAndNavigate } = useResetSessionAndNavigate();

  if (isErrorAlertVisible) return;
  isErrorAlertVisible = true;

  const isUnauthorized = statusCode === 401;

  if (Platform.OS === "web") {
    window.alert(
      isUnauthorized
        ? `${i18n.t("label.sessionExpired")}, ${i18n.t("label.loginAgain")}`
        : message
    );

    if (isUnauthorized) {
      resetSessionAndNavigate();
    }

    releaseAlertLock(2000);
    return;
  }

  Alert.alert(
    isUnauthorized ? i18n.t("label.sessionExpired") : message,
    isUnauthorized ? i18n.t("label.loginAgain") : "",
    [
      {
        text: "OK",
        onPress: () => {
          if (isUnauthorized) {
            resetSessionAndNavigate();
          }
          releaseAlertLock();
        },
      },
    ],
    { cancelable: false }
  );
};
