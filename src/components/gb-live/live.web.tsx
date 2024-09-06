import React from "react";
import { StyleSheet } from "react-native";
import { Tab } from "@rneui/themed";

import { GbTotalsList } from "./bottom-sheet-tabs/totals-list/totals-list";
import { GbUnitGroupsList } from "./bottom-sheet-tabs/unit-groups-list/unit-groups-list";
import SvgMap from "./svg-map/svg-map";
import NativeAppDownloadLinks from "./native-app-download-links";
import StaleDataCard from "./stale-data-card";

const MapTab: React.FC = () => {
  return (
    <div style={styles.container}>
      <SvgMap />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  listWrapper: {
    flex: 1,
    height: 300,
  },
});

const Live: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  return (
    <>
      <Tab value={currentTab} onChange={setCurrentTab} dense>
        <Tab.Item>Map</Tab.Item>
        <Tab.Item>Totals</Tab.Item>
        <Tab.Item>List</Tab.Item>
        <Tab.Item>App</Tab.Item>
      </Tab>
      <>
        <StaleDataCard />
        {currentTab === 0 && <MapTab />}
        {currentTab === 1 && <GbTotalsList />}
        {currentTab === 2 && (
          <div style={styles.listWrapper}>
            <GbUnitGroupsList />
          </div>
        )}
        {currentTab === 3 && <NativeAppDownloadLinks />}
      </>
    </>
  );
};

export default Live;
