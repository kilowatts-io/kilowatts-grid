// add a layout component that wraps an error boundary, redux provider, and a loader for skia (for web)
import React from "react";
import { store } from "../state";
import { Provider as ReduxProvider } from "react-redux";
import ErrorBoundary from "../components/error-boundary";
import { Stack } from "expo-router";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <Stack 
            screenOptions={{
                headerShown: false,
            }}
        />
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default Layout;
