/// a loading screen

import { View, StyleSheet } from "react-native";
import React from "react";
import { Button, Card , ActivityIndicator} from "react-native-paper";
import { useNavigation } from "expo-router";

const LoadingScreen: React.FC<{
  refetch: () => void;
}> = (p) => {
  const nav = useNavigation();
  React.useEffect(() => {
    nav.setOptions({
      headerShown: false,
    });
    return () => {
      nav.setOptions({
        headerShown: true,
      });
    };
  }, [nav]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Loading" />
        <Card.Content>
          <ActivityIndicator size="large" />
        </Card.Content>
        <Card.Actions>
          <Button onPress={p.refetch}>Retry</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default LoadingScreen;
