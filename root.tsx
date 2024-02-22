import React from "react";
import { Alert, AppState, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { captureException } from "@sentry/react-native";
import * as Updates from "expo-updates";

import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import GbLive from "./components/gb-live/live";
import { useGbSummaryOutputQuery } from "./state/apis/cloudfront/api";
import { store } from "./state/reducer";
import { initSentry } from "./utils/sentry";
// import { checkUpdatesRequireStateRefresh } from "./utils/version";

const checkUpdates = () => {
  if (__DEV__) return;

  Updates.checkForUpdateAsync().then((update) => {
    if (update.isAvailable) {
      Alert.alert(
        "App update",
        "A new version of the app is available. App must reload.",
        [
          {
            text: "OK",
            onPress: () =>
              Updates.fetchUpdateAsync().then(() => {
                Updates.reloadAsync();
              })
          }
        ]
      );
    }
  });
};

export default function RootApp() {
  React.useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("./utils/reactotron").initReactotron();
    }
  }, []);

  React.useEffect(() => {
    // check for updates on launch
    checkUpdates();
  }, []);

  // watch app state and set background
  React.useEffect(() => {
    if (Platform.OS == "ios" || Platform.OS == "android") {
      initSentry();
    }
  });

  return (
    <ErrorBoundaryWithRecovery>
      <Provider store={store}>
        <GestureHandlerRootView style={styles.gestureRootView}>
          <WithFromBackgroundRefresh />
        </GestureHandlerRootView>
      </Provider>
    </ErrorBoundaryWithRecovery>
  );
}

const WithFromBackgroundRefresh = () => {
  // const [reloading, setReloading] = React.useState(false);
  const { refetch } = useGbSummaryOutputQuery();
  const [background, setBackground] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active" && background) {
        checkUpdates();
        // console.log("App has come to the foreground - refetching data");
        try {
          // setReloading(true);
          await refetch();
          // console.log("Data refetched");
        } catch (e) {
          captureException(e);
        } finally {
          // console.log("Done refetching data");
          // setReloading(false);
        }
        setBackground(false);
      } else {
        setBackground(nextAppState !== "active");
      }
    };
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, [refetch, background]);
  return <GbLive />;
};

const styles = StyleSheet.create({
  gestureRootView: {
    flex: 1
  }
});
