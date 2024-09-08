import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Card, Icon, Text } from "@rneui/themed";

interface ErrorDataRetryCardProps {
  refetch: () => void;
}
export const ErrorDataRetryCard: React.FC<ErrorDataRetryCardProps> = (p) => {
  return (
    <Card>
      <Card.Title>Error</Card.Title>
      <View style={styles.spaced}>
        <Text>
          Failed to load data from the internet. Check your internet connection
          and try again.
        </Text>
      </View>
      <Button
        onPress={() => p.refetch()}
        iconPosition="right"
        icon={<Icon name="refresh" type="material" size={15} color="white" />}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  spaced: {
    paddingBottom: 20,
    paddingTop: 20,
  },
});
