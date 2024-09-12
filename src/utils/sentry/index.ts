import * as Sentry from '@sentry/react-native';
import { LogBox } from "react-native";

export const initialise = () => {
  LogBox.ignoreAllLogs(true);
  if(__DEV__) return;
  Sentry.init({dsn: "https://138c61a058da7beace9f46fab06e3f58@o4505890996748288.ingest.us.sentry.io/4506466896314368"})
};

export const errorHandler = (error: Error, stackTrace: string) => {
  if(__DEV__) return;
  Sentry.captureException(error);
};
