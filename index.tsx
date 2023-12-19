import React from "react";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./services/state";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@rneui/themed";
import { WithLicense } from "./components/WithLicense";
import * as Updates from "expo-updates";
import { Alert, AppState, AppStateStatus, useColorScheme } from "react-native";
import log from "./services/log";
import theme from "./services/theme";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

/*
onFetchUpdateAsync() checks for updates from expo and downloads them if available.
*/
async function onFetchUpdateAsync() {
  log.debug("Checking for Expo updates...");
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      log.debug("Downloading Expo update...");
      await Updates.fetchUpdateAsync();
      log.debug("Reloading app...");
      Alert.alert("App updated", "The app will now reload.", [
        {
          text: "OK",
          onPress: () => Updates.reloadAsync(),
        },
      ]);
    } else {
      log.debug("No Expo update available.");
    }
  } catch (error) {
    // You can also add an alert() to see the error message in case of an error when fetching updates.
    log.error(`Error fetching latest Expo update: ${error}`);
  }
}

export const App = () => {
  const colorScheme = useColorScheme();

  //   React.useEffect(() => {
  //     if (__DEV__ && Platform.OS !== "web") {
  //       const rt = require("./services/reactotron").initReactotron;
  //       rt();
  //     }
  //   }, []);

  // on initial load, check for updates
  React.useEffect(() => {
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

  // on resuming from background, check for updates
  React.useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active" && !__DEV__) {
        onFetchUpdateAsync();
      }
    };
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      (AppState as any).removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const ctx = require.context("./app");

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <WithLicense>
          <ExpoRoot context={ctx} />
        </WithLicense>
      </Provider>
    </ThemeProvider>
  );
};

registerRootComponent(App);
