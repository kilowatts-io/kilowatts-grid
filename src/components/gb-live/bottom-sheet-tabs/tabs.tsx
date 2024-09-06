import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Tab } from "@rneui/themed";


import { GbTotalsList } from "./totals-list/totals-list";
import { GbUnitGroupsList } from "./unit-groups-list/unit-groups-list";
import { selectors } from "@/src/state/live";

interface GbLiveBottomSheetTabsProps {
  usableHeight?: number;
}
export const GbLiveBottomSheetTabs: React.FC<GbLiveBottomSheetTabsProps> = ({
  usableHeight,
}) => {
  const selectedGeneratorId = useSelector(selectors.selectedUnitGroupCode);
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
        style={{
          ...styles.listContentContainer,
          height: usableHeight,
        }}
      >
        {index === 0 && <GbTotalsList />}
        {index === 1 && <GbUnitGroupsList />}
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
