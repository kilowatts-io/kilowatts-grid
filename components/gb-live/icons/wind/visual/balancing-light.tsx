import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { BalancingDirectionLightMap } from "../../balancing-direction-light/map-icon";

import {
  BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO,
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  MINIMUM_HEIGHT_PX
} from "./constants";

type BalancingLightProps = {
  point: { x: number; y: number };
  balancing: SharedValue<"bid" | "offer" | "none">;
  sizePx: SharedValue<number>;
};

export const WindTurbineBalancingLightMap: React.FC<BalancingLightProps> = ({
  point,
  balancing,
  sizePx
}) => {
  const height = useDerivedValue(
    () => Math.max(sizePx.value, MINIMUM_HEIGHT_PX),
    [sizePx]
  );
  const width = useDerivedValue(
    () => height.value * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
    [sizePx]
  );
  const balancingR = useDerivedValue(
    () => width.value * BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO,
    [width]
  );

  return (
    <BalancingDirectionLightMap
      center={point}
      r={balancingR}
      balancing={balancing}
    />
  );
};
