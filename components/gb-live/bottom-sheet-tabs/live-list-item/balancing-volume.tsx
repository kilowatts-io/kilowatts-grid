import React from "react";
import { Text, StyleSheet, View } from "react-native";
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
  balancingVolume,
}) => {
  return (
    <View
      style={{
        ...styles.balancing,
        backgroundColor: getBalancingColor(balancingVolume),
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
    maxWidth: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 2,
    padding: 3,
    height: "80%",
  },
  balancingText: {
    color: "white",
    textAlign: "right",
    fontSize: 9,
  },
});
