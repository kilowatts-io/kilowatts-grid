import React from "react";
import { useDerivedValue } from "react-native-reanimated";

import { MapContext } from "../../svg-map/context";
import { BalancingDirectionLightMap } from "../balancing-direction-light/map-icon";

import { TurbineWheelMap } from "./turbine";

const BALANCING_DIRECTION_LIGHT_R = 0.5;

type DispatchableIconMapProps = {
  maxSizePx: number;
  capacityFactor: number;
  cycleSeconds: number;
  point: { x: number; y: number };
  backgroundColor: string;
};

export const DispatchableIconMap: React.FC<DispatchableIconMapProps> = ({
  maxSizePx,
  point,
  backgroundColor,
  capacityFactor,
  cycleSeconds
}) => {
  const r = Math.max(maxSizePx, 3);
  const opacity = 0.3 + 0.7 * capacityFactor;
  return (
    <TurbineWheelMap
      point={point}
      height={r}
      backgroundColor={backgroundColor}
      opacity={opacity}
      cycleSeconds={cycleSeconds}
    />
  );
};

interface DispatchableIconBalancingLightMapProps {
  point: { x: number; y: number };
  maxSizePx: number;
  balancing: "bid" | "offer" | "none";
}

export const DispatchableIconBalancingLightMap: React.FC<
  DispatchableIconBalancingLightMapProps
> = ({ point, maxSizePx, balancing }) => {
  const { zoomPan } = React.useContext(MapContext);
  const balancingR = useDerivedValue(() => {
    return (maxSizePx / zoomPan.value.scale) * BALANCING_DIRECTION_LIGHT_R;
  }, [maxSizePx, zoomPan]);
  return (
    <BalancingDirectionLightMap
      center={point}
      r={balancingR}
      balancing={balancing}
    />
  );
};

type DispatchableMapIconProps = {
  sizePx: number;
  capacityFactor: number;
  point: { x: number; y: number };
  balancing: "bid" | "offer" | "none";
  backgroundColor: string;
  cycleSeconds: number;
};

export const DispatchableMapIcon: React.FC<DispatchableMapIconProps> = ({
  sizePx,
  capacityFactor,
  point,
  backgroundColor,
  cycleSeconds,
  balancing
}) => {
  return (
    <>
      <DispatchableIconMap
        maxSizePx={sizePx}
        capacityFactor={capacityFactor}
        point={point}
        backgroundColor={backgroundColor}
        cycleSeconds={cycleSeconds}
      />
      <DispatchableIconBalancingLightMap
        balancing={balancing}
        point={point}
        maxSizePx={sizePx}
      />
    </>
  );
};
