import React, { useContext } from "react";
import { Circle, Line, useClock } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { MapContext } from "../../svg-map/context";
import { CanvasPoint } from "../../svg-map/types";
import {
  CABLE_COLOR,
  CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO,
  CABLE_OPACITY,
  ELECTRON_COLOR,
} from "./constants";
import { calculateCableLength, calculateDims } from "./calcs";

type CableProps = {
  from: CanvasPoint;
  to: CanvasPoint;
  cycleSeconds: SharedValue<number>;
  width: number;
};

export const Cable: React.FC<CableProps> = ({
  from,
  to,
  width,
  cycleSeconds,
}) => {
  const { gestureMode } = useContext(MapContext);
  const t = useClock();
  const dims = calculateDims(from, to);
  const cableLength = calculateCableLength(dims);
  const progress = useDerivedValue(() => {
    if (gestureMode.value !== "none" || cycleSeconds.value == null) return 0;
    const rotationFraction =
      t.value /
      1000 /
      (Math.abs(cycleSeconds.value) * cableLength * CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO);
    const modulusRotationFraction = rotationFraction % 1;
    return modulusRotationFraction
  });

  const isExport = React.useMemo(() => cycleSeconds.value !== null && cycleSeconds.value < 0, [cycleSeconds.value]);
  const cx = useDerivedValue(() => isExport ? from.x + dims.x * progress.value : to.x - dims.x * progress.value);
  const cy = useDerivedValue(() => isExport ? from.y + dims.y * progress.value : to.y - dims.y * progress.value);

  return (
    <>
      <Line
        p1={from}
        p2={to}
        color={CABLE_COLOR}
        strokeWidth={width}
        opacity={CABLE_OPACITY}
      />
      <Circle r={width / 2} color={ELECTRON_COLOR} cx={cx} cy={cy} />
    </>
  );
};
