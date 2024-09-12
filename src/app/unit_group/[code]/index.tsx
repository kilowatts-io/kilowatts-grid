// create a hello world page
import React from "react";
import SmallLargeScreen from "@/src/components/small-large-screen";
import { UnitGroupLargeScreen, UnitGroupSmallScreen } from "@/src/components/unit-group";

export default () => (
  <SmallLargeScreen small={UnitGroupSmallScreen} large={UnitGroupLargeScreen} />
);
