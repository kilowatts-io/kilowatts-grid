import React from "react";

import { BalancingDirectionLightMap } from "../../balancing-direction-light/map-icon";

import {
  BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO,
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  MINIMUM_HEIGHT_PX
} from "./constants";

type BalancingLightProps = {
  point: { x: number; y: number };
  balancing: "bid" | "offer" | "none";
  sizePx: number;
};

export const WindTurbineBalancingLightMap: React.FC<BalancingLightProps> = ({
  point,
  balancing,
  sizePx
}) => {
  const height = Math.max(sizePx, MINIMUM_HEIGHT_PX);
  const width = height * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO;
  const balancingR = width * BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO;

  return (
    <BalancingDirectionLightMap
      center={point}
      r={balancingR}
      balancing={balancing}
    />
  );
};
