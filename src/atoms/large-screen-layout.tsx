/// a simple screen that splits content into a left and right side
import React from "react";
import { View, StyleSheet } from "react-native";
import { LEFT_WIDTH } from "../hooks/screen";

const LargeScreen: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = (p) => {
  return (
    <View style={styles.wholeScreen}>
      <View style={styles.left}>{p.left}</View>
      <View style={styles.right}>{p.right}</View>
    </View>
  );
};

export default LargeScreen;

const styles = StyleSheet.create({
  wholeScreen: { flex: 1, display: "flex", flexDirection: "row" },
  left: {
    minWidth: LEFT_WIDTH
  },
  right: {
    flex: 1
  },
});
