import React from "react";

import { DISPATCHABLE_ICON_COLOURS } from "./constants";
import { TurbineWheelList } from "./turbine";

interface DispatchableListIconProps {
  cycleSeconds: number;
  type: "gas" | "oil" | "coal" | "nuclear" | "hydro" | "wind" | "biomass";
}

export const DispatchableListIcon: React.FC<DispatchableListIconProps> = ({
  cycleSeconds,
  type
}) => (
  <TurbineWheelList
    backgroundColor={DISPATCHABLE_ICON_COLOURS[type]}
    cycleSeconds={cycleSeconds}
  />
);
