// add a layout component that wraps an error boundary, redux provider, and a loader for skia (for web)
import React from "react";
import { store } from "../state";
import { Provider as ReduxProvider } from "react-redux";
import ErrorBoundary from "../components/error-boundary";
import { Stack } from "expo-router";
import { initialise } from "../utils/sentry";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout: React.FC = () => {
  React.useEffect(() => {
    initialise();
  }, []);
  return (
    <ErrorBoundary>
      <GestureHandlerRootView>
      <ReduxProvider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ReduxProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default Layout;
