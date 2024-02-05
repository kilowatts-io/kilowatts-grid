import React from "react";
import { Provider } from "react-redux";
import { Platform, StyleSheet } from "react-native";
import { store } from "./state/reducer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GbLive } from "./components/gb-live/live";
import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import { initSentry } from "./utils/sentry";

export default function RootApp() {
  // React.useEffect(() => {
  //   if (__DEV__ && Platform.OS !== "web") {
  //     require("./utils/reactotron").initReactotron();
  //   } 
  // }, []);

  React.useEffect(() => {
    initSentry()
  })

  return (
    <ErrorBoundaryWithRecovery>
        <Provider store={store}>
          <GestureHandlerRootView style={styles.gestureRootView}>
            <GbLive/>
          </GestureHandlerRootView>
        </Provider>
    </ErrorBoundaryWithRecovery>
  );
}

const styles = StyleSheet.create({
  gestureRootView: {
    flex: 1,
  },
});
