import React from "react";
import { Tabs } from "expo-router";
import { InfoModal } from "../components/InfoModal";
import log from "../services/log";

type TabsWithInfoIconProps = {
  children: React.ReactNode;
  headerShown?: boolean;
};
export const TabsWithInfoIcon: React.FC<TabsWithInfoIconProps> = ({
  children,
  headerShown
}) => {
  log.debug("TabsWithInfoIcon");
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown,
          tabBarShowLabel: false,
          headerRight: InfoModal,
        }}
      >
        {children}
      </Tabs>
    </>
  );
};
