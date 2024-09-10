import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Circle, Line, useClock } from "@shopify/react-native-skia";
import * as c from "@/src/constants";

export const calculateCableLength = (dims: CanvasPoint) =>
  Math.sqrt(dims.x * dims.x + dims.y * dims.y);

export const useWeights = (cycleSeconds: number, isExport: boolean) => {
  const clock = useClock();
  return useDerivedValue(() => {
    const progress = (clock.value / (cycleSeconds * 1000)) % 1
    return !isExport ? {
      gb: progress,
      fm: 1 - progress,
    } : {
      gb: 1 - progress,
      fm: progress,
    }
  }, [cycleSeconds, isExport]);
}

const CableElectron: React.FC<MapCableProps & {
  cycleSeconds: number;
}> = (p) => {
  const weights = useWeights(p.cycleSeconds, p.isExport);
  const cx = useDerivedValue(() => p.point.x * weights.value.gb + p.foreignMarket.point.x * weights.value.fm);
  const cy = useDerivedValue(() => p.point.y * weights.value.gb + p.foreignMarket.point.y * weights.value.fm);
  
  return <Circle cx={cx} cy={cy} r={p.sizePx} color={c.ELECTRON_COLOR}/>;
}

export const CableMapIcon: React.FC<MapCableProps> = (p) => {

  return (
    <>
      <Line
        p1={p.point}
        p2={p.foreignMarket.point}
        color={c.CABLE_COLOR}
        strokeWidth={p.sizePx}
        opacity={c.CABLE_OPACITY}
      />
      {p.cycleSeconds > 0 && <CableElectron {...p}/>}
    </>
  );
};
