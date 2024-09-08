import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";
import { calculateBatteryColor } from "./calcs";
import * as c from "@/src/constants";

export const BatteryMapIcon: React.FC<MapGeneratorIconProps> = (p) => {
  const color = p.cycleSeconds ? calculateBatteryColor(p.cycleSeconds) : "grey";
  const batteryWidth = c.BATTERY_BASE_WIDTH_FRACTION * p.sizePx;
  const batteryTerminalHeight =
    p.sizePx * c.BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO;
  const terminalWidth = c.BATTERY_TERMINAL_WIDTH_FRACTION * batteryWidth;
  const topLeftX = p.point.x - p.sizePx * (3 / 8);
  const topLeftY = p.point.y - p.sizePx / 2;
  const batteryRoundedness = p.sizePx * c.BATTERY_R_TO_HEIGHT_RATIO;
  const batteryStrokeWidth = p.sizePx * c.BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO;
  const batteryTerminalTop =
    topLeftY + c.calculateBatteryTerminalTop(p.sizePx, batteryTerminalHeight);
  const topLeftTerminalX = batteryWidth + topLeftX;

  return (
    <>
      <RoundedRect
        x={topLeftX}
        y={topLeftY}
        width={batteryWidth}
        height={p.sizePx}
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
