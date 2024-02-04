import React from "react";
import { Text, StyleSheet, View } from "react-native";

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
  deltaText: {
    textAlign: "center",
  },
  delta: {
    width: 10,
    display: "flex",
  },
});

