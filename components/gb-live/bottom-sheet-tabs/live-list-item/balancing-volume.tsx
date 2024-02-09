import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatMW } from "./formatters";

interface BalancingVolumeViewProps {
  balancingVolume: number;
}

const renderBalancingText = (volume: number) => {
  return formatMW(Math.abs(volume));
};

const getBalancingColor = (volume: number) => {
  if (volume > 0) return "green";
  if (volume < 0) return "red";
  return undefined;
};

export const BalancingVolumeView: React.FC<BalancingVolumeViewProps> = ({
  balancingVolume
}) => {
  return (
    <View
      style={{
        ...styles.balancing,
        backgroundColor: getBalancingColor(balancingVolume)
      }}
    >
      <Text style={styles.balancingText}>
        {renderBalancingText(balancingVolume)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  balancing: {
    alignItems: "flex-end",
    borderRadius: 2,
    display: "flex",
    height: "80%",
    justifyContent: "center",
    maxWidth: 80,
    padding: 3
  },
  balancingText: {
    color: "white",
    fontSize: 9,
    textAlign: "right"
  }
});
