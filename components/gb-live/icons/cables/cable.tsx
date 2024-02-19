import React, { useContext } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, Line, useClock } from "@shopify/react-native-skia";

import { MapContext } from "../../svg-map/context";
import { CanvasPoint } from "../../svg-map/types";

import { calculateCableLength, calculateDims } from "./calcs";
import {
  CABLE_COLOR,
  CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO,
  CABLE_OPACITY,
  ELECTRON_COLOR
} from "./constants";

type CableProps = {
  from: CanvasPoint;
  to: CanvasPoint;
  cycleSeconds: number;
  width: number;
  isExport: boolean;
};

export const Cable: React.FC<CableProps> = ({
  from,
  to,
  width,
  cycleSeconds
}) => {
  console.log("CableProps", from, to, width, cycleSeconds);
  const { gestureMode } = useContext(MapContext);
  const t = useClock();
  const dims = calculateDims(from, to);
  const cableLength = calculateCableLength(dims);
  const progress = useDerivedValue(() => {
    if (gestureMode.value !== "none" || cycleSeconds == null) return 0;
    const rotationFraction =
      t.value /
      1000 /
      (Math.abs(cycleSeconds) *
        cableLength *
        CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO);
    const modulusRotationFraction = rotationFraction % 1;
    return modulusRotationFraction;
  });

  const isExport = React.useMemo(
    () => cycleSeconds !== null && cycleSeconds < 0,
    [cycleSeconds]
  );
  const cx = useDerivedValue(() =>
    isExport ? from.x + dims.x * progress.value : to.x - dims.x * progress.value
  );
  const cy = useDerivedValue(() =>
    isExport ? from.y + dims.y * progress.value : to.y - dims.y * progress.value
  );

  return (
    <>
      <Line
        p1={from}
        p2={to}
        color={CABLE_COLOR}
        strokeWidth={width}
        opacity={CABLE_OPACITY}
      />
      <Circle
        r={width / 2}
        color={ELECTRON_COLOR}
        cx={cx}
        cy={cy}
      />
    </>
  );
};
