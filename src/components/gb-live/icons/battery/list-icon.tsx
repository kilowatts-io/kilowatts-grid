import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";

import { ICON_LIST_HEIGHT, ICON_LIST_WIDTH } from "../list-icons";

import { calculateBatteryColor } from "./calcs";
import {
  BATTERY_BASE_WIDTH_FRACTION,
  BATTERY_R_TO_HEIGHT_RATIO,
  BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO,
  BATTERY_TERMINAL_WIDTH_FRACTION,
  BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO,
  calculateBatteryTerminalTop,
} from "./constants";

const BATTERY_ROUNDEDNESS = ICON_LIST_HEIGHT * BATTERY_R_TO_HEIGHT_RATIO;
const BATTERY_WIDTH = ICON_LIST_WIDTH * BATTERY_BASE_WIDTH_FRACTION;
const BATTERY_TERMINAL_WIDTH =
  ICON_LIST_WIDTH * BATTERY_TERMINAL_WIDTH_FRACTION;

const BATTERY_TERMINAL_HEIGHT =
  ICON_LIST_HEIGHT * BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO;
const BATTERY_TERMINAL_TOP = calculateBatteryTerminalTop(
  ICON_LIST_HEIGHT,
  BATTERY_TERMINAL_HEIGHT,
);

const BATTERY_STROKE_WIDTH =
  BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO * ICON_LIST_HEIGHT;

interface BatteryListIconProps {
  cycleSeconds: number;
}

export const BatteryListIcon: React.FC<BatteryListIconProps> = (p) => {
  const color = React.useMemo(
    () => calculateBatteryColor(p.cycleSeconds),
    [p.cycleSeconds],
  );
  return (
    <>
      <RoundedRect
        x={0}
        y={0}
        width={BATTERY_WIDTH}
        height={ICON_LIST_HEIGHT}
        r={BATTERY_ROUNDEDNESS}
        color={color}
        style={"stroke"}
        strokeWidth={BATTERY_STROKE_WIDTH}
      />
      <RoundedRect
        x={BATTERY_WIDTH}
        y={BATTERY_TERMINAL_TOP}
        width={BATTERY_TERMINAL_WIDTH}
        height={BATTERY_TERMINAL_HEIGHT}
        r={BATTERY_ROUNDEDNESS}
        color={color}
      />
    </>
  );
};
