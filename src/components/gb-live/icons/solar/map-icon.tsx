import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";

import { CanvasPoint } from "../../svg-map/types";

import { SolarBalancingLightMap } from "./balancing-light";

interface SolarListIconProps {
  point: CanvasPoint;
  cycleSeconds: number| null;
  capacityFactor: number  | null;
  sizePx: number;
  balancing: "bid" | "offer" | "none";
}

const SUN_COLOR = "#FDB813";

const SolarMapIcon: React.FC<SolarListIconProps> = (p) => {
  const c = useClock();
  const r = useDerivedValue(() => {
    if(!p.cycleSeconds) return 0;
    const t = c.value / 1000;
    const r = Math.abs(Math.sin((t * 2 * Math.PI) / p.cycleSeconds));
    return (r * p.sizePx) / 2;
  });

  return (
    <>
      <Circle
        cx={p.point.x}
        cy={p.point.y}
        r={r}
        color={SUN_COLOR}
        opacity={p.capacityFactor ? Math.max(0.3, p.capacityFactor) : 0.1}
      />
      <SolarBalancingLightMap
        point={p.point}
        balancing={p.balancing}
        sizePx={p.sizePx * 2}
      />
    </>
  );
};

export default SolarMapIcon;
