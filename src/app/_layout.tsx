// add a layout component that wraps an error boundary, redux provider, and a loader for skia (for web)
import React from "react";
import { store, persistor } from "../state";
import { Provider as ReduxProvider } from "react-redux";
import ErrorBoundary from "../components/error-boundary";
import { Stack } from "expo-router";
import { initialise } from "../utils/sentry";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { ScreenContext } from "../contexts/screen";

const Layout: React.FC = () => {
  React.useEffect(() => {
    initialise();
  }, []);
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ScreenContext.Provider value={null}>
            <GestureHandlerRootView>
              <Stack 
                screenOptions={{
                  headerShown: false,
                }}
              />
            </GestureHandlerRootView>
          </ScreenContext.Provider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default Layout;
