// create a hello world page

import React from "react";
import { WithAppData } from "../contexts/data";
import { HomeScreen as Screen } from "../components/split-screen";
import { Stack } from "expo-router";

const HomeScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WithAppData>
        <Screen />
      </WithAppData>
    </>
  );
};

export default HomeScreen;
