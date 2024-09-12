import { LargeScreenRedirect } from "@/src/hooks/screen";
import React from "react";
import { FuelTypeMapScreen } from "@/src/components/fuel-type";
import * as nav from "@/src/utils/nav";

export default () => (
  <LargeScreenRedirect redirectUrl={nav.fuel_type_map(nav.useFuelType())}>
    <FuelTypeMapScreen />
  </LargeScreenRedirect>
);
