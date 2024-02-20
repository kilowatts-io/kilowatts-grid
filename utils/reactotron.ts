import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initReactotron = () => {
  // DevSettings.reload();
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
      host: "192.168.0.27"
    })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/
      },
      editor: false,
      overlay: false
    })
    .use(reactotronRedux())
    .use(sagaPlugin({ except: [""] }))
    .connect();
};
