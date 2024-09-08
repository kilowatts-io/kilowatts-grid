import React from "react";
import { RoundedRect } from "@shopify/react-native-skia";

import { calculateBatteryColor } from "./calcs";
import * as c from "@/src/constants";

export const BatteryListIcon: React.FC<AppListIconProps> = (p) => {
  const color = React.useMemo(
    () => calculateBatteryColor(p.cycleSeconds),
    [p.cycleSeconds]
  );
  return (
    <>
      <RoundedRect
        x={0}
        y={0}
        width={c.BATTERY_WIDTH}
        height={c.ICON_LIST_HEIGHT}
        r={c.BATTERY_ROUNDEDNESS}
        color={color}
        style={"stroke"}
        strokeWidth={c.BATTERY_STROKE_WIDTH}
      />
      <RoundedRect
        x={c.BATTERY_WIDTH}
        y={c.BATTERY_TERMINAL_TOP}
        width={c.BATTERY_TERMINAL_WIDTH}
        height={c.BATTERY_TERMINAL_HEIGHT}
        r={c.BATTERY_ROUNDEDNESS}
        color={color}
      />
    </>
  );
};
