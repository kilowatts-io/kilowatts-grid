// create a hello world page

import React from "react";
import { WithAppData } from "../contexts/data";
import { HeaderBar, HomeScreen } from "../components/split-screen";
import { Stack } from "expo-router";

const App: React.FC = () => {
  return (
    <>
      <Stack.Screen
        options={{
          header: (props) => <HeaderBar title="Kilowatts Grid" {...props} />,
        }}
      />
      <WithAppData>
        <HomeScreen />
      </WithAppData>
    </>
  );
};

export default App;
