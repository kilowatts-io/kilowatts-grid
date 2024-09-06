import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    alignItems: "flex-end",
    display: "flex",
    justifyContent: "center",
    width: 110,
  },
  outputText: {
    fontSize: 11,
    textAlign: "right",
  },
});
