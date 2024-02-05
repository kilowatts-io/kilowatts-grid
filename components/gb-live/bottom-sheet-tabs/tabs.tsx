import React from "react";
import { StyleSheet, View } from "react-native";
import { GbUnitGroupsList } from "./unit-groups-list/unit-groups-list";
import { Tab } from "@rneui/themed";
import { useSelector } from "react-redux";
import { selectors } from "../../../state/gb/live";
import { GbTotalsList } from "./totals-list/totals-list";

export const GbLiveBottomSheetTabs = () => {
  const selectedGeneratorId = useSelector(selectors.selectedUnitGroupCode);
  const [index, setIndex] = React.useState(selectedGeneratorId ? 1 : 0);

  React.useEffect(() => {
    // is a generator selected - ensure that the generator tab is selected
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
      <View style={styles.listContentContainer}>
        {index === 0 && <GbTotalsList />}
        {index === 1 && <GbUnitGroupsList />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    paddingBottom: 50,
  },
  tabTitleStyle: {
    fontSize: 10,
  },
  listContentContainer: {
    height: '100%'
  },
});
