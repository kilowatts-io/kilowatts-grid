import * as React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

import { ErrorBoundaryWithRecovery } from "./components/gb-live/error-boundary";
import { store } from "./state/reducer";

const RootApp: React.FC = () => {
  return (
    // <ErrorBoundaryWithRecovery>
    <Provider store={store}>
      <GestureHandlerRootView style={styles.gestureRootView}>
        <WithSkiaWeb
          getComponent={async () => {
            const Live = (await import("./components/gb-live/live")).default;
            // return <div>loaded</div>;
            return { default: () => <Live /> };
          }}
          fallback={<span>Loading Map...</span>}
        />
      </GestureHandlerRootView>
    </Provider>
    // </ErrorBoundaryWithRecovery>
  );
};

export default RootApp;

const styles = StyleSheet.create({
  gestureRootView: {
    flex: 1
  }
});
