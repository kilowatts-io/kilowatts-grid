import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";
import * as c from "@/src/constants";

const useOpacity = (cycleSeconds: number) => {
  return useDerivedValue(() => {
    if (cycleSeconds === 0) return 0;
    const exact = Math.max(0.3, 1 / cycleSeconds);
    const rounded = Math.round(exact * 10) / 10;
    return rounded;
  }, [cycleSeconds]);
};

const useR = (cycleSeconds: number) => {
  const clock = useClock();
  return useDerivedValue(() => {
    const t = clock.value / 1000;
    const r = Math.abs(Math.sin((t * 2 * Math.PI) / cycleSeconds));
    return (r * c.ICON_LIST_WIDTH) / 2;
  }, [cycleSeconds]);
};

const SolarCircle: React.FC<{
  cx: number;
  cy: number;
  r: SharedValue<number>;
  opacity: SharedValue<number>;
}> = (p) => <Circle {...p} color={c.SUN_COLOR} />;

export const SolarListIcon: React.FC<AppListIconProps> = (p) => {
  const opacity = useOpacity(p.cycleSeconds);
  const r = useR(p.cycleSeconds);
  return (
    <SolarCircle
      cx={c.LIST_ICON_CX}
      cy={c.LIST_ICON_CY}
      r={r}
      opacity={opacity}
    />
  );
};

export const SolarMapIcon: React.FC<MapGeneratorIconProps> = (p) => {
  const r = useR(p.cycleSeconds);
  const opacity = useOpacity(p.cycleSeconds);
  return <SolarCircle cx={p.point.x} cy={p.point.y} r={r} opacity={opacity} />
};

export default SolarListIcon;
