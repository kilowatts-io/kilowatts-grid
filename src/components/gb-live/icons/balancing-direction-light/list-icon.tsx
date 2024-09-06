import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";
import { BALANCING_COLORS } from "@/src/utils/colors";
import {
  LIST_ICON_BALANCING_LIGHT_R,
  LIST_ICON_CX,
  LIST_ICON_CY,
} from "../list-icons";

export type BalancingDirectionLightListProps = {
  balancing: "bid" | "offer";
};

export const BalancingDirectionLightList: React.FC<
  BalancingDirectionLightListProps
> = (p) => {
  const c = useClock();
  const opacity = useDerivedValue(() => {
    const timeMs = c.value;
    const modulus = timeMs % 1000;
    return (500 - modulus) / 500;
  }, []);
  return (
    <Circle
      color={BALANCING_COLORS[p.balancing]}
      cx={LIST_ICON_CX}
      cy={LIST_ICON_CY}
      r={LIST_ICON_BALANCING_LIGHT_R}
      opacity={opacity}
    />
  );
};
