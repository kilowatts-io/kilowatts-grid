import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FuelType } from "../common/types";
import { UnitGroupsLive } from "../components/UnitGroupsLive";

export const FuelTypeLiveScreen = () => {
  const { fuelType } = useLocalSearchParams<{ fuelType: FuelType }>();
  return <UnitGroupsLive fuelType={fuelType} />;
};
