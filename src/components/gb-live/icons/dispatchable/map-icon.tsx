import React from "react";


const BALANCING_DIRECTION_LIGHT_R = 0.5;

export const DispatchableIconMap: React.FC<MapGeneratorIconProps> = (p) => {
  const r = Math.max(p.sizePx, 3);
  return (
    <TurbineWheelMap
      {...p}
      backgroundColor={DISPATCHABLE_ICON_COLOURS[p.fuel_type]}
      height={r}
      opacity={3}
    />
  );
};

export const DispatchableIconBalancingLightMap: React.FC<
  DispatchableMapGeneratorIconProps
> = (p) => (
  <BalancingDirectionLightMap
    {...p}
    sizePx={p.sizePx * BALANCING_DIRECTION_LIGHT_R}
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
