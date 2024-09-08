import React from "react";
import { WindTurbineBladesList } from "./visual/blades";
import { WindTurbineMastList } from "./visual/mast";
import { WindTurbineBalancingLightMap } from "./visual/balancing-light";
import { WindTurbineBladesMap } from "./visual/blades";
import { WindTurbineMastMap } from "./visual/mast";

export const WindListIcon: React.FC<AppListIconProps> = ({ cycleSeconds }) => {
  return (
    <>
      <WindTurbineBladesList cycleSeconds={cycleSeconds} />
      <WindTurbineMastList />
    </>
  );
};

export const WindMapIcon: React.FC<MapGeneratorIconProps> = (p) => (
  <>
    <WindTurbineBalancingLightMap {...p} />
    <WindTurbineMastMap {...p} />
    <WindTurbineBladesMap {...p} />
  </>
);
