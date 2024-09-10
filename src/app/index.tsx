// create a hello world page

import React from "react";
import { WithAppData } from "../contexts/data";
import { HomeScreen } from "../components/split-screen";
import { Stack } from "expo-router";

const App: React.FC = () => {
 
  return (
    <WithAppData>
      <Stack.Screen
        options={{title: "gb.kilowatts.io"}}
      />
      <HomeScreen/>
    </WithAppData>
  );
};

export default App;
