import React from "react";
import { SharedValue } from "react-native-reanimated";
import { RoundedRect } from "@shopify/react-native-skia";

import { calculateBatteryColor } from "./calcs";
import {
  BATTERY_BASE_WIDTH_FRACTION,
  BATTERY_R_TO_HEIGHT_RATIO,
  BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO,
  BATTERY_TERMINAL_WIDTH_FRACTION,
  BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO,
  calculateBatteryTerminalTop
} from "./constants";

interface BatteryMapIconProps {
  point: { x: number; y: number };
  maxSizePx: number;
  capacityFactor: number;
  cycleSeconds: number;
}

export const BatteryMapIcon: React.FC<BatteryMapIconProps> = ({
  point,
  maxSizePx,
  cycleSeconds
}) => {
  const color = calculateBatteryColor(cycleSeconds);
  const batteryWidth = BATTERY_BASE_WIDTH_FRACTION * maxSizePx;
  const batteryTerminalHeight =
    maxSizePx * BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO;
  const terminalWidth = BATTERY_TERMINAL_WIDTH_FRACTION * batteryWidth;
  const topLeftX = point.x - maxSizePx * (3 / 8);
  const topLeftY = point.y - maxSizePx / 2;
  const batteryRoundedness = maxSizePx * BATTERY_R_TO_HEIGHT_RATIO;
  const batteryStrokeWidth = maxSizePx * BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO;
  const batteryTerminalTop =
    topLeftY + calculateBatteryTerminalTop(maxSizePx, batteryTerminalHeight);
  const topLeftTerminalX = batteryWidth + topLeftX;

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
