import React from "react";
import RnErrorBoundary from "react-native-error-boundary";
import { errorHandler } from "../../utils/sentry";
import { View, Text, Button } from "react-native";

export const AppErrorScreen = (props: {
  error: Error;
  resetError: () => void;
}) => (
  <View>
    <Text>App Error</Text>
    <Text>{props.error.toString()}</Text>
    <Button onPress={props.resetError} title={"Try again"} />
  </View>
);


const BlankComponent: React.FC = () => <></>;

/**
 * Render components like canvases and fallback to nothing if an error occurs
 */
export const ErrorBoundaryBlank: React.FC<{
  children: React.ReactNode;
}> = ({ children }) =>   <RnErrorBoundary onError={errorHandler} FallbackComponent={BlankComponent}>
<>{children}</>
</RnErrorBoundary>

const ErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <RnErrorBoundary onError={errorHandler} FallbackComponent={AppErrorScreen}>
      <>{children}</>
    </RnErrorBoundary>
  );
};
export default ErrorBoundary;
