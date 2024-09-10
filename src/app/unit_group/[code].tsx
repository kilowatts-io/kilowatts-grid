// create a hello world page

import { UnitGroupScreen as Screen } from "@/src/components/split-screen";
import { WithAppData } from "@/src/contexts/data";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const FuelTypeScreen: React.FC = () => {
  const code = useLocalSearchParams().code as string;
  return (
    <WithAppData>
      <Stack.Screen
        options={{
          title: "Loading",
        }}
      />
      <Screen code={code} />
    </WithAppData>
  );
};

export default FuelTypeScreen;
