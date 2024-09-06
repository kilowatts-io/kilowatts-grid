import { StyleSheet, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { Button, Card, Divider, Text } from "@rneui/themed";

interface FallbackComponentProps {
  error: Error;
  resetError: () => void;
}

const Spacer = () => <View style={styles.spacer} />;

const FallbackComponent: React.FC<FallbackComponentProps> = (p) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Something went wrong</Card.Title>
        <Text>
          Sorry but the app encountered an error and needs to refresh.
        </Text>
        <Spacer />
        <Spacer />
        <Divider />
        <Button onPress={() => p.resetError()} title="Refresh" />
      </Card>
    </View>
  );
};

interface ErrorBoundaryWithRecoveryProps {
  children: JSX.Element;
}

export const ErrorBoundaryWithRecovery: React.FC<
  ErrorBoundaryWithRecoveryProps
> = (p) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {p.children}
    </ErrorBoundary>
  );
};

const Blank = () => <></>;
export const ErrorBoundaryBlank: React.FC<{
  children: JSX.Element;
}> = (p) => {
  return <ErrorBoundary FallbackComponent={Blank}>{p.children}</ErrorBoundary>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  spacer: {
    height: 20,
  },
});
