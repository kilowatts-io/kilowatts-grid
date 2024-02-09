import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const LiveItemName: React.FC<{ name: string }> = ({ name }) => {
  return (
    <View style={styles.name}>
      <Text>{name}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  name: {}
});
