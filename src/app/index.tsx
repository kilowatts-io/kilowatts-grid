// create a hello world page

import React from "react";
import { Text, StyleSheet, View } from "react-native";
import SkiaExampleComponent from "../components/skia-example";

const HelloWorld: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkiaExampleComponent/>
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
export default HelloWorld;
