// a

import React from "react";
import RnErrorBoundary from "react-native-error-boundary";
import { errorHandler } from "../../utils/sentry";
import { View, Text, Button } from "react-native";

const CustomFallback = (props: { error: Error; resetError: () => void }) => (
  <View>
    <Text>App Error</Text>
    <Text>{props.error.toString()}</Text>
    <Button onPress={props.resetError} title={"Try again"} />
  </View>
);

const ErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <RnErrorBoundary onError={errorHandler} FallbackComponent={CustomFallback}>
      <>{children}</>
    </RnErrorBoundary>
  );
};
export default ErrorBoundary;
