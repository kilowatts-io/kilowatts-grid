import React from "react";
import { TurbineWheelMap } from "./turbine";
import { MapContext } from "../../svg-map/context";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { BalancingDirectionLightMap } from "../balancing-direction-light/map-icon";

const BALANCING_DIRECTION_LIGHT_R = 0.5;

type DispatchableIconMapProps = {
  maxSizePx: SharedValue<number>;
  capacityFactor: SharedValue<number>;
  cycleSeconds: SharedValue<number>;
  point: { x: number; y: number };
  backgroundColor: string;
};

export const DispatchableIconMap: React.FC<DispatchableIconMapProps> = ({
  maxSizePx,
  point,
  backgroundColor,
  capacityFactor,
  cycleSeconds,
}) => {
  const { zoomPan } = React.useContext(MapContext);
  const r = useDerivedValue(() => {
    return Math.max(maxSizePx.value / zoomPan.value.scale, 3);
  }, [maxSizePx, zoomPan]);
  const opacity = useDerivedValue(() => {
    return 0.3 + 0.7 * capacityFactor.value;
  });
  return (
    <TurbineWheelMap
      point={point}
      height={r}
      backgroundColor={backgroundColor}
      opacity={opacity.value}
      cycleSeconds={cycleSeconds}
    />
  );
};

interface DispatchableIconBalancingLightMapProps {
  point: { x: number; y: number };
  maxSizePx: SharedValue<number>;
  balancing: SharedValue<"bid" | "offer" | "none">;
}

export const DispatchableIconBalancingLightMap: React.FC<
  DispatchableIconBalancingLightMapProps
> = ({ point, maxSizePx, balancing }) => {
  const { zoomPan } = React.useContext(MapContext);
  const balancingR = useDerivedValue(() => {
    return (
      (maxSizePx.value / zoomPan.value.scale) * BALANCING_DIRECTION_LIGHT_R
    );
  }, [maxSizePx, zoomPan]);
  return (
    <BalancingDirectionLightMap
      center={point}
      r={balancingR}
      balancing={balancing}
    />
  );
};
