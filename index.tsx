import React from "react";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./services/state";
// import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

export const App = () => {
//   React.useEffect(() => {
//     if (__DEV__ && Platform.OS !== "web") {
//       const rt = require("./services/reactotron").initReactotron;
//       rt();
//     }
//   }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const ctx = require.context("./app");

  if (!loaded) {
    return null;
  }
  return (
    // <ThemeProvider>
      <Provider store={store}>
          <ExpoRoot context={ctx} />
      </Provider>
    // </ThemeProvider>
  );
};

registerRootComponent(App);