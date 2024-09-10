// add a layout component that wraps an error boundary, redux provider, and a loader for skia (for web)
import React from "react";
import { store, persistor } from "../state";
import { Provider as ReduxProvider } from "react-redux";
import ErrorBoundary from "../components/error-boundary";
import { Stack } from "expo-router";
import { initialise } from "../utils/sentry";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";

const CustomNavigationBar: React.FC<NativeStackHeaderProps> = (p) => {
  const title = getHeaderTitle(p.options, p.route.name);
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={p.navigation.goBack} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

const Layout: React.FC = () => {
  React.useEffect(() => {
    initialise();
  }, []);
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView>
            <Stack
              screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
              }}
            />
          </GestureHandlerRootView>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default Layout;
