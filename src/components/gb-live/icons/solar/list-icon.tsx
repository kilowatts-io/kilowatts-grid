import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, useClock } from "@shopify/react-native-skia";

import { ICON_LIST_WIDTH, LIST_ICON_CX, LIST_ICON_CY } from "../list-icons";

interface SolarListIconProps {
  cycleSeconds: number;
}

const SUN_COLOR = "#FDB813";

const calculateSolarOpacity = (cycleSeconds: number) => {
  if (cycleSeconds === 0) return 0;
  const exact = Math.max(0.3, 1 / cycleSeconds);
  const rounded = Math.round(exact * 10) / 10;
  return rounded;
};

const SolarListIcon: React.FC<SolarListIconProps> = ({ cycleSeconds }) => {
  const opacity = React.useMemo(
    () => calculateSolarOpacity(cycleSeconds),
    [cycleSeconds],
  );
  const c = useClock();
  const r = useDerivedValue(() => {
    const t = c.value / 1000;
    const r = Math.abs(Math.sin((t * 2 * Math.PI) / cycleSeconds));
    return (r * ICON_LIST_WIDTH) / 2;
  });

  return (
    <Circle
      cx={LIST_ICON_CX}
      cy={LIST_ICON_CY}
      r={r}
      color={SUN_COLOR}
      opacity={opacity}
    />
  );
};

export default SolarListIcon;
