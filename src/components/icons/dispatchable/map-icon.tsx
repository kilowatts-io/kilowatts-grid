import React from "react";
import { BalancingDirectionLightMap } from "@/src/atoms/balancing-direction-light/map-icon";
import { TurbineWheelMap } from "./turbine";
import * as c from "@/src/constants";

export const DispatchableIconMap: React.FC<MapGeneratorIconProps> = (p) => {
  const r = Math.max(p.sizePx, 3);
  return (
    <TurbineWheelMap
      {...p}
      backgroundColor={c.DISPATCHABLE_ICON_COLOURS[p.fuel_type]}
      height={r}
    />
  );
};

export const DispatchableIconBalancingLightMap: React.FC<
  DispatchableMapGeneratorIconProps
> = (p) => (
  <BalancingDirectionLightMap
    {...p}
    sizePx={p.sizePx * c.BALANCING_DIRECTION_LIGHT_R}
  />
);

export const DispatchableMapIcon: React.FC<
  DispatchableMapGeneratorIconProps
> = (p) => (
<>
    <DispatchableIconMap {...p} />
    <DispatchableIconBalancingLightMap {...p} />
  </>
);
