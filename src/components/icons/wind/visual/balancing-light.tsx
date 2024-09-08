import React from "react";
import { BalancingDirectionLightMap } from "@/src/atoms/balancing-direction-light/map-icon";
import { MINIMUM_HEIGHT_PX, MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO, BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO } from "@/src/constants";

export const WindTurbineBalancingLightMap: React.FC<MapGeneratorIconProps> = (
  p
) => {
  const height = Math.max(p.sizePx, MINIMUM_HEIGHT_PX);
  const width = height * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO;
  const balancingR = width * BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO;

  return <BalancingDirectionLightMap {...p} sizePx={balancingR} />;
};
