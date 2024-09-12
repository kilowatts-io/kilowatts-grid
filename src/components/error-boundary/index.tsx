import React from "react";
import RnErrorBoundary from "react-native-error-boundary";
import { errorHandler } from "../../utils/sentry";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";

export const AppErrorScreen = (props: { error: Error; resetError: () => void }) => (
  <View style={styles.container}>
    <Card>
      <Card.Title title="App Error" />
      <Card.Content>
        <Text>{props.error.toString()}</Text>
      </Card.Content>
      <Button onPress={props.resetError}>Retry</Button>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});


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
