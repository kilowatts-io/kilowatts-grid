import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import { GbLive } from "./components/gb-live/live";
import { store } from "./state/reducer";
import { initSentry } from "./utils/sentry";
import { checkUpdatesRequireStateRefresh } from "./utils/version";

export default function RootApp() {
  // React.useEffect(() => {
  //   if (__DEV__ && Platform.OS !== "web") {
  //     require("./utils/reactotron").initReactotron();
  //   }
  // }, []);

  React.useEffect(() => {
    checkUpdatesRequireStateRefresh();
  }, []);

  React.useEffect(() => {
    initSentry();
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
