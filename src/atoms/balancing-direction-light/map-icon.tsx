import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";
import { getBalancingColor } from "@/src/utils/colors";
import { useSvgMapContext } from "@/src/contexts/svg-map";

export const BalancingDirectionLightMap: React.FC<MapGeneratorIconProps> = (p) => {
  const { gestureMode } = useSvgMapContext();
  const clock = useClock();
  const color = getBalancingColor(p.balancing_volume);

  const opacity = useDerivedValue(() => {
    if (gestureMode.value !== "none" || p.balancing_volume == 0) return 0;
    const timeMs = clock.value;
    const modulus = timeMs % 1000;
    return (500 - modulus) / 500;
  }, [gestureMode.value, p.balancing_volume]);

  return (
    <Circle
      color={color}
      cx={p.point.x}
      cy={p.point.y}
      r={p.sizePx}
      opacity={opacity}
    />
  );
};
