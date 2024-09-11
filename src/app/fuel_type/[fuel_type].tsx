// create a hello world page

import {
  HeaderBar,
  FuelTypeScreen as Screen,
} from "@/src/components/split-screen";
import { WithAppData } from "@/src/contexts/data";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Stack } from "expo-router";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const FuelTypeScreen: React.FC = () => {
  const fuel_type = useLocalSearchParams().fuel_type as FuelType;
  return (
    <>
      <Stack.Screen
        options={{
          header: (props) => (
            <HeaderBar title={capitalise(fuel_type)} {...props} backUrl="/"
            />
          ),
        }}
      />
      <WithAppData>
        <Screen fuel_type={fuel_type} />
      </WithAppData>
    </>
  );
};

export default FuelTypeScreen;
