import { Group, RoundedRect } from "@shopify/react-native-skia";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  BATTERY_BASE_WIDTH_FRACTION,
  BATTERY_R_TO_HEIGHT_RATIO,
  BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO,
  BATTERY_TERMINAL_WIDTH_FRACTION,
  BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO,
  calculateBatteryTerminalTop,
} from "./constants";
import { calculateBatteryColor } from "./calcs";

interface BatteryMapIconProps {
  point: { x: number; y: number };
  maxSizePx: SharedValue<number>;
  capacityFactor: SharedValue<number>;
  cycleSeconds: SharedValue<number>;
}

export const BatteryMapIcon: React.FC<BatteryMapIconProps> = ({
  point,
  maxSizePx,
  cycleSeconds,
}) => {
  const color = React.useMemo(
    () => calculateBatteryColor(cycleSeconds.value),
    [cycleSeconds.value]
  );
  const batteryWidth = useDerivedValue(
    () => BATTERY_BASE_WIDTH_FRACTION * maxSizePx.value,
    [maxSizePx]
  );
  const batteryTerminalHeight = useDerivedValue(
    () => maxSizePx.value * BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO,
    [maxSizePx]
  );
  const terminalWidth = useDerivedValue(
    () => BATTERY_TERMINAL_WIDTH_FRACTION * batteryWidth.value,
    [maxSizePx]
  );
  const topLeftX = useDerivedValue(
    () => point.x - maxSizePx.value * (3 / 8),
    [maxSizePx]
  );
  const topLeftY = useDerivedValue(
    () => point.y - maxSizePx.value / 2,
    [maxSizePx]
  );
  const batteryRoundedness = useDerivedValue(
    () => maxSizePx.value * BATTERY_R_TO_HEIGHT_RATIO,
    [maxSizePx]
  );
  const batteryStrokeWidth = useDerivedValue(
    () => maxSizePx.value * BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO,
    [maxSizePx]
  );
  const batteryTerminalTop = useDerivedValue(
    () =>
      topLeftY.value +
      calculateBatteryTerminalTop(maxSizePx.value, batteryTerminalHeight.value),
    [maxSizePx, batteryTerminalHeight]
  );
  const topLeftTerminalX = useDerivedValue(
    () => batteryWidth.value + topLeftX.value,
    [terminalWidth]
  );

  return (
    <>
      <RoundedRect
        x={topLeftX}
        y={topLeftY}
        width={batteryWidth}
        height={maxSizePx}
        r={batteryRoundedness}
        color={color}
        style={"stroke"}
        strokeWidth={batteryStrokeWidth}
      />
      <RoundedRect
        x={topLeftTerminalX}
        y={batteryTerminalTop}
        width={terminalWidth}
        height={batteryTerminalHeight}
        r={batteryRoundedness}
        color={color}
      />
    </>
  );
};
