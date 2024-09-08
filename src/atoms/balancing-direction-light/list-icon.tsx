import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";
import { getBalancingColor } from "@/src/utils/colors";
import * as c from "@/src/constants";

export const BalancingDirectionLightList: React.FC<
AppListIconProps
> = (p) => {
  const clock = useClock();
  const opacity = useDerivedValue(() =>  (500 - clock.value % 1000) / 500, []);
  return (
    <Circle
      color={getBalancingColor(p.balancing_volume)}
      cx={c.LIST_ICON_CX}
      cy={c.LIST_ICON_CY}
      r={c.LIST_ICON_BALANCING_LIGHT_R}
      opacity={opacity}
    />
  );
};
