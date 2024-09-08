import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Tab } from "@rneui/themed";
import { selectUnitGroupCode } from "@/src/state/live";
import { FuelTypesList, UnitGroupsList } from "./icon-list-item";

export const Tabs: React.FC = () => {
  const selectedGeneratorId = useSelector(selectUnitGroupCode);
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (selectedGeneratorId !== null && index == 0) setIndex(1);
  }, [selectedGeneratorId]);

  return (
    <>
      <Tab
        titleStyle={styles.tabTitleStyle}
        value={index}
        onChange={setIndex}
        dense
      >
        <Tab.Item>Totals</Tab.Item>
        <Tab.Item>Generators</Tab.Item>
      </Tab>
      <View
        style={styles.listContentContainer}
      >
        {index === 0 && <FuelTypesList />}
        {index === 1 && <UnitGroupsList />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  tabTitleStyle: {
    fontSize: 10,
  },
});
