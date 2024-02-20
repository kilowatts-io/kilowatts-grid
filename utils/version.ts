import { Alert } from "react-native";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import { gbLiveSlice } from "../state/gb/live";
import { store } from "../state/reducer";

const APP_VERSION_KEY = "currentVersion";
const REVISION_ID_KEY = "revisionId";

const userAlert = () => {
  if (__DEV__)
    Alert.alert("App has been updated or re-installed. Reloading grid data.");
};

export const checkUpdatesRequireStateRefresh = async () => {
  try {
    const currentVersion = DeviceInfo.getVersion();
    const storedVersion = await AsyncStorage.getItem(APP_VERSION_KEY);
    if (storedVersion !== currentVersion) {
      console.log("App has been updated. Resetting Redux state.");

      store.dispatch(gbLiveSlice.actions.resetInitialState());
      await AsyncStorage.setItem(APP_VERSION_KEY, currentVersion);
      userAlert();
      return;
    }
  } catch (e) {
    console.error("Error checking for updates: ", e);
  }

  // check for a revision update

  try {
    const currentRevisionId = Updates.manifest.runtimeVersion;
    if (!currentRevisionId) {
      return;
    }
    const storedRevisionId = await AsyncStorage.getItem(REVISION_ID_KEY);
    if (storedRevisionId !== currentRevisionId) {
      console.log("App has been updated. Resetting Redux state.");
      store.dispatch(gbLiveSlice.actions.resetInitialState());
      await AsyncStorage.setItem(REVISION_ID_KEY, currentRevisionId.toString());
      userAlert;
      return;
    }
  } catch (e) {
    console.error("Error checking for updates: ", e);
  }
};
