/// a loading screen

import { View, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { Button, Card } from "@rneui/themed";

const LoadingScreen: React.FC<{
  refetch: () => void;
}> = (p) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Loading</Card.Title>
        <ActivityIndicator size="large" />
        <Button onPress={p.refetch}>Retry</Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
