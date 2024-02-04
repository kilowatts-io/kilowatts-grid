import React from "react";
import { TurbineWheelList } from "./turbine";
import { DISPATCHABLE_ICON_COLOURS } from "./constants";

interface DispatchableListIconProps {
  cycleSeconds: number;
  type: "gas" | "oil" | "coal" | "nuclear" | "hydro" | "wind" | "biomass";
}

export const DispatchableListIcon: React.FC<DispatchableListIconProps> = ({
  cycleSeconds,
  type,
}) => (
  <TurbineWheelList
    backgroundColor={DISPATCHABLE_ICON_COLOURS[type]}
    cycleSeconds={cycleSeconds}
  />
);
