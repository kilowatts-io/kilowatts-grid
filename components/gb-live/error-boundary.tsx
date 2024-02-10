import { StyleSheet, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { Button, Card, Divider, Text } from "@rneui/themed";

interface FallbackComponentProps {
  error: Error;
  resetError: () => void;
}

const Spacer = () => <View style={styles.spacer} />;

const FallbackComponent: React.FC<FallbackComponentProps> = ({
  error,
  resetError
}) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Something went wrong</Card.Title>
        <Text>
          Sorry but the app encountered an error and needs to refresh.
        </Text>
        <Spacer />
        <Text>{error.message}</Text>
        <Spacer />
        <Divider />
        <Button
          onPress={() => resetError()}
          title="Refresh"
        />
      </Card>
    </View>
  );
};

interface ErrorBoundaryWithRecoveryProps {
  children: JSX.Element;
}

export const ErrorBoundaryWithRecovery: React.FC<
  ErrorBoundaryWithRecoveryProps
> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

const Blank = () => <></>;
export const ErrorBoundaryBlank: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={Blank}>{children}</ErrorBoundary>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  spacer: {
    height: 20
  }
});
