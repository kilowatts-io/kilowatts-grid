import React from "react";
import { TurbineWheelList } from "./turbine";
import { DISPATCHABLE_ICON_COLOURS } from "@/src/constants";

export const DispatchableListIcon: React.FC<AppListIconProps> = (
  p
) => (
  <TurbineWheelList
    {...p}
    backgroundColor={DISPATCHABLE_ICON_COLOURS[p.fuel_type]}
  />
);