import * as Sentry from '@sentry/react'

export const initialise = () => {
  if(__DEV__) return;
  Sentry.init({dsn: "https://3c939b287c552ff45b9d35217091ef2b@o4505890996748288.ingest.us.sentry.io/4506466906734592"})
};

export const errorHandler = (error: Error, stackTrace: string) => {
  if (__DEV__) {
    // log out the full error and stack trace
    console.error(error);
    console.error(stackTrace);
  }
  Sentry.captureException(error);
};
