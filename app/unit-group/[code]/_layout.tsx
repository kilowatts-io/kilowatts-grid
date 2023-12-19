import React from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "../../../atoms/icons";
import { TabsWithInfoIcon } from "../../../components/TabsWithInfoIcon";
import log from "../../../services/log";
import { UnitGroup } from "../../../common/types";
import WithUnitGroupCode from "../../../components/WithUnitGroupCode";

type UnitGroupTabsProps = {
  ug: UnitGroup;
};

const UnitGroupTabs: React.FC<UnitGroupTabsProps> = ({ ug }) => {
  log.debug("UnitGroupTabs");
  const { name } = ug.details;
  return (
    <TabsWithInfoIcon
      headerShown={false}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: `${name}: Live`,
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              testID="unit-group-live-tab-icon"
              name="live-tv"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: `${name}: History`,
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              testID="unit-group-units-tab-icon"
              name="history"
              color={color}
            />
          ),
        }}
      />
    </TabsWithInfoIcon>
  );
};

export default () => {
  return <WithUnitGroupCode component={UnitGroupTabs} />;
};
