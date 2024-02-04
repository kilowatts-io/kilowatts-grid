import ErrorBoundary from "react-native-error-boundary";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Text, Divider } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

interface FallbackComponentProps {
  error: Error;
  resetError: () => void;
}

const Spacer = () => <View style={styles.spacer}/>

const FallbackComponent: React.FC<FallbackComponentProps> = ({
  error,
  resetError,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title>Something went wrong</Card.Title>
        <Text>
          Sorry but the app encountered an error and needs to refresh.
        </Text>
        <Spacer/>
        <Text>{error.message}</Text>
        <Spacer/>
        <Divider />
        <Button onPress={() => resetError()} title="Refresh" />
      </Card>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    height: 20,
  }
});
