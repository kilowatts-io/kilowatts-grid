import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "@rneui/themed";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}
const Pagination: React.FC<PaginationProps> = (p) => {
  return (
    <View style={styles.container}>
      <Button
        title="Previous"
        onPress={p.onPrevious}
        disabled={p.currentPage <= 0}
        buttonStyle={styles.button}
      />
      <Text>
        Page {p.currentPage + 1} of {Math.trunc(p.totalPages + 1)}
      </Text>
      <Button
        title="Next"
        onPress={p.onNext}
        disabled={p.currentPage >= p.totalPages}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Add your button styling here
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    padding: 10,
  },
});

export default Pagination;
