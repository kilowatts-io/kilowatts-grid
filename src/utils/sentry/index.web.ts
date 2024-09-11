import * as Sentry from '@sentry/react'

export const initialise = () => {
  Sentry.init({dsn: "https://3c939b287c552ff45b9d35217091ef2b@o4505890996748288.ingest.us.sentry.io/4506466906734592"})
};

export const errorHandler = (error: Error, stackTrace: string) => {
  Sentry.captureException(error);
};
