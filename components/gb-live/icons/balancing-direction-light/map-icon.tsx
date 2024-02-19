import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";

import { BALANCING_COLORS } from "../../../../utils/colors";
import { MapContext } from "../../svg-map/context";
import { CanvasPoint } from "../../svg-map/types";

export type BalancingDirectionLightMapProps = {
  r: number;
  center: CanvasPoint;
  balancing: "bid" | "offer" | "none";
};

export const BalancingDirectionLightMap: React.FC<
  BalancingDirectionLightMapProps
> = (p) => {
  const { gestureMode } = React.useContext(MapContext);
  const c = useClock();
  const color = useDerivedValue(() => BALANCING_COLORS[p.balancing], []);

  const opacity = useDerivedValue(() => {
    if (gestureMode.value !== "none" || p.balancing == "none") return 0;
    const timeMs = c.value;
    const modulus = timeMs % 1000;
    return (500 - modulus) / 500;
  }, [gestureMode.value, p.balancing]);

  return (
    <Circle
      color={color}
      cx={p.center.x}
      cy={p.center.y}
      r={p.r}
      opacity={opacity}
    />
  );
};
