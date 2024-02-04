import useGbCycleSeconds from "./cycle-seconds";
import useGbBalancing from "./balancing";
import useGbSizePx from "./size-px";
import useGbCapacityFactor from "./capacity-factor";

export const useGbMapIconGenerator = (unitGroupCode: string) => ({
  sizePx: useGbSizePx(unitGroupCode),
  cycleSeconds: useGbCycleSeconds(unitGroupCode),
  balancing: useGbBalancing(unitGroupCode),

});

export { useGbCycleSeconds, useGbBalancing, useGbSizePx, useGbCapacityFactor}