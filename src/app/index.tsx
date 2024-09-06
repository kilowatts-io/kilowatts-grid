// create a hello world page

import React from "react";
import { StyleSheet, View } from "react-native";
import GbLiveWrapped from "../components/gb-live/live";

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <GbLiveWrapped />
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
export default App;
