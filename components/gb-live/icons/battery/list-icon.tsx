import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";
import { ICON_LIST_HEIGHT, ICON_LIST_WIDTH } from "../list-icons";
import { calculateBatteryColor } from "./calcs";

const BATTERY_BASE_WIDTH_FRACTION = 0.8;
const BATTERY_TERMINAL_WIDTH_FRACTION = 1 - BATTERY_BASE_WIDTH_FRACTION;

const BATTERY_R_TO_HEIGHT_RATIO = 0.1;
const BATTERY_ROUNDEDNESS = ICON_LIST_HEIGHT * BATTERY_R_TO_HEIGHT_RATIO;

const BATTERY_WIDTH = ICON_LIST_WIDTH * BATTERY_BASE_WIDTH_FRACTION;
const BATTERY_TERMINAL_WIDTH =
  ICON_LIST_WIDTH * BATTERY_TERMINAL_WIDTH_FRACTION;

const BATTERY_TERMINAL_HEIGHT = ICON_LIST_HEIGHT * 0.3;
const BATTERY_TERMINAL_TOP = (ICON_LIST_HEIGHT - BATTERY_TERMINAL_HEIGHT) / 2;

interface BatteryListIconProps {
  cycleSeconds: number;
}

export const BatteryListIcon: React.FC<BatteryListIconProps> = (p) => {
  const color = React.useMemo(
    () => calculateBatteryColor(p.cycleSeconds),
    [p.cycleSeconds]
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
        strokeWidth={2}
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
