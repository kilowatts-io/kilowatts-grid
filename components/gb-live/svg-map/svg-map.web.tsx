import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SvgMapWeb = () => {
  return (
    <View style={styles.container}>
      <Text>Map is not yet available on the web. Try our mobile app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});

export default SvgMapWeb;
