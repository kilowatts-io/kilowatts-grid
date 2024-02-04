import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { formatMW } from "./formatters";

interface OutputVolumeViewProps {
  capacity: number;
  output: number;
}

export const OutputVolumeView: React.FC<OutputVolumeViewProps> = ({
  capacity,
  output,
}) => {
  return (
    <View style={styles.output}>
      <Text style={styles.outputText}>
        {`${formatMW(output)} / ${formatMW(capacity)}`}
      </Text>
    </View>
  );
};

export const OutputVolumeViewEmpty = () => <View style={styles.output} />;

const styles = StyleSheet.create({
  output: {
    width: 110,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  outputText: {
    textAlign: "right",
    fontSize: 11,
  },
});
