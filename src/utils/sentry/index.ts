// import * as Sentry from '@sentry/react-native';
import { LogBox } from "react-native";

export const initialise = () => {
  // let's disable the annoying logbox for RN
  LogBox.ignoreAllLogs(true);
};

export const errorHandler = (error: Error, stackTrace: string) => {
  /* Log the error to an error reporting service */
  // sentry
};
