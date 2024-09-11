// create a hello world page

import React from "react";
import { WithAppData } from "../contexts/data";
import { HomeScreen } from "../components/split-screen";
import { Stack } from "expo-router";

const App: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Kilowatts grid" }} />
      <WithAppData>
        <HomeScreen />
      </WithAppData>
    </>
  );
};

export default App;
