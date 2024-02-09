import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const DeltaVolumeView: React.FC<{ delta: number }> = ({ delta }) => {
  let symbol = "-";
  let color = "grey";

  if (delta > 0) {
    symbol = "↑";
    color = "green";
  } else if (delta < 0) {
    symbol = "↓";
    color = "red";
  }

  return (
    <View style={styles.delta}>
      <Text style={{ ...styles.deltaText, color }}>{symbol}</Text>
    </View>
  );
};

export const DeltaVolumeViewEmpty = () => <View style={styles.delta} />;

const styles = StyleSheet.create({
  delta: {
    display: "flex",
    width: 10
  },
  deltaText: {
    textAlign: "center"
  }
});
