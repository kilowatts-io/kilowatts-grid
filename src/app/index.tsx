// create a hello world page

import React from "react";
import { StyleSheet, View } from "react-native";
import { WithAppData } from "../contexts/data";
import { UnitGroupsList } from "../components/icon-list-item";

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <WithAppData>

        <UnitGroupsList/>

      </WithAppData>
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
