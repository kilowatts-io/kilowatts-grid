import React from "react";

import { WindTurbineBladesList } from "./visual/blades";
import { WindTurbineMastList } from "./visual/mast";
interface WindListIconProps {
  cycleSeconds: number | null;
}
export const WindListIcon: React.FC<WindListIconProps> = ({ cycleSeconds }) => {
  return (
    <>
      <WindTurbineBladesList cycleSeconds={cycleSeconds} />
      <WindTurbineMastList />
    </>
  );
};
