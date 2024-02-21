import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import GbLive from "./components/gb-live/live";
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

  React.useEffect(() => {
    if (Platform.OS == "ios" || Platform.OS == "android") {
      initSentry();
    }
  });

  return (
    <ErrorBoundaryWithRecovery>
      <Provider store={store}>
        <GestureHandlerRootView style={styles.gestureRootView}>
          <GbLive />
        </GestureHandlerRootView>
      </Provider>
    </ErrorBoundaryWithRecovery>
  );
}

const styles = StyleSheet.create({
  gestureRootView: {
    flex: 1
  }
});
