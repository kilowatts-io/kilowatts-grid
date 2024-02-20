import React from "react";

import { BalancingDirectionLightMap } from "../balancing-direction-light/map-icon";

type BalancingLightProps = {
  point: { x: number; y: number };
  balancing: "bid" | "offer" | "none";
  sizePx: number;
};

export const MAX_SIZE_PX_TO_CAPACITY_RATIO = 0.5;
export const MINIMUM_HEIGHT_PX = 3;
export const MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO = 0.065;
export const BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO = 2.5;
export const SolarBalancingLightMap: React.FC<BalancingLightProps> = (p) => {
  const height = Math.max(p.sizePx, MINIMUM_HEIGHT_PX);
  const width = height * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO;
  const balancingR = width * BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO;

  return (
    <BalancingDirectionLightMap
      center={p.point}
      r={balancingR}
      balancing={p.balancing}
    />
  );
};
