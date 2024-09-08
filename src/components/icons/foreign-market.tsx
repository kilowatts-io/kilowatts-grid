import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, Line, useClock } from "@shopify/react-native-skia";
import * as c from "@/src/constants";
import { useSvgMapContext } from "@/src/contexts/svg-map";

export const calculateDims = (from: CanvasPoint, to: CanvasPoint) => ({
  x: to.x - from.x,
  y: to.y - from.y,
});

export const calculateCableLength = (dims: CanvasPoint) =>
  Math.sqrt(dims.x * dims.x + dims.y * dims.y);

export const CableMapIcon: React.FC<MapCableProps> = (p) => {
  const { gestureMode } = useSvgMapContext();
  const clock = useClock();
  const dims = calculateDims(p.point, p.foreignMarket.point);
  const cableLength = calculateCableLength(dims);
  const progress = useDerivedValue(() => {
    if (gestureMode.value !== "none" || p.cycleSeconds.value == null) return 0;
    const rotationFraction =
      clock.value /
      1000 /
      (Math.abs(p.cycleSeconds) *
        cableLength *
        c.CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO);
    const modulusRotationFraction = rotationFraction % 1;
    return modulusRotationFraction;
  }, [gestureMode.value, p.cycleSeconds.value]);

  const cx = useDerivedValue(() =>
    p.isExport
      ? p.point.x + dims.x * progress.value
      : p.point.x - dims.x * progress.value
  );
  const cy = useDerivedValue(() =>
    p.isExport
      ? p.foreignMarket.point.y + dims.y * progress.value
      : p.foreignMarket.point.y - dims.y * progress.value
  );
  return (
    <>
      <Line
        p1={p.point}
        p2={p.foreignMarket.point}
        color={c.CABLE_COLOR}
        strokeWidth={dims.x}
        opacity={c.CABLE_OPACITY}
      />
      <Circle r={dims.x / 2} color={c.ELECTRON_COLOR} cx={cx} cy={cy} />
    </>
  );
};
