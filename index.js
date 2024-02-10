import { LogBox } from "react-native";
import registerRootComponent from "expo/build/launch/registerRootComponent";

import AppRoot from "./root";
// import AppRoot from './.storybook'

LogBox.ignoreAllLogs(true);
registerRootComponent(AppRoot);
