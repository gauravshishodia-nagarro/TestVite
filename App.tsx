import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation/rootStack";
import "./assets/styles/global.css";
import React from "react";
import { useUserPreferenceStore } from "./src/stores/userPreferencesStore";
import { ClickOutsideProvider } from "react-native-click-outside";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalProvider } from "@tamagui/portal";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { GlobalOverlay } from "./src/pages/overlay/GlobalOverlay";
import { generateTWKToken, useAutoLogin } from "./src/helpers/twkHelper";

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

const queryClient = new QueryClient();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: "tabs/home",
      About: "tabs/about",
      NotFound: "*",
      tabs: "tabs",
    },
  },
  // Optional: automatically generate paths for all screens
  // enabled: 'auto',
};

export default function App() {
  const { accessToken, isTWKTokenValid } = useUserPreferenceStore();
  React.useEffect(() => {
    if(!accessToken){
    useUserPreferenceStore.getState().updateUserPreferences({
      userType: "GUEST",
    });
  }
  }, [accessToken]);

  return (
    <>
    <NavigationContainer linking={linking}>
      <GestureHandlerRootView>
        <ClickOutsideProvider>
          <PortalProvider shouldAddRootHost>
            <QueryClientProvider client={queryClient}>
              <RootStack />
            </QueryClientProvider>
          </PortalProvider>
        </ClickOutsideProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
    <GlobalOverlay visible={!isTWKTokenValid || !accessToken} />
    </>
  );
}
