import React from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { captureException } from "@sentry/react-native";

import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import GbLive from "./components/gb-live/live";
import { useGbSummaryOutputQuery } from "./state/apis/cloudfront/api";
import { store } from "./state/reducer";
import { initSentry } from "./utils/sentry";
// import { checkUpdatesRequireStateRefresh } from "./utils/version";

export default function RootApp() {
  React.useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("./utils/reactotron").initReactotron();
    }
  }, []);

  // React.useEffect(() => {
  //   checkUpdatesRequireStateRefresh();
  // }, []);

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
  const [reloading, setReloading] = React.useState(false);
  const { refetch } = useGbSummaryOutputQuery();
  const [background, setBackground] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active" && background) {
        // console.log("App has come to the foreground - refetching data");
        try {
          setReloading(true);
          await refetch();
          // console.log("Data refetched");
        } catch (e) {
          captureException(e);
        } finally {
          // console.log("Done refetching data");
          setReloading(false);
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
  if (reloading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <GbLive />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  gestureRootView: {
    flex: 1
  }
});
