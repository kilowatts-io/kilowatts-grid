// create a hello world page

import { FuelTypeScreen as Screen } from "@/src/components/split-screen";
import { WithAppData } from "@/src/contexts/data";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const FuelTypeScreen: React.FC = () => {
  const fuel_type = useLocalSearchParams().fuel_type as FuelType;
  return (
    <WithAppData>
      <Screen fuel_type={fuel_type} />
    </WithAppData>
  );
};

export default FuelTypeScreen;