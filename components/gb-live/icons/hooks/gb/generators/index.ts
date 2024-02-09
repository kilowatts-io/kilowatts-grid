import useGbBalancing from "./balancing";
import useGbCapacityFactor from "./capacity-factor";
import useGbCycleSeconds from "./cycle-seconds";
import useGbSizePx from "./size-px";

export const useGbMapIconGenerator = (unitGroupCode: string) => ({
  sizePx: useGbSizePx(unitGroupCode),
  cycleSeconds: useGbCycleSeconds(unitGroupCode),
  balancing: useGbBalancing(unitGroupCode)
});

export { useGbBalancing, useGbCapacityFactor, useGbCycleSeconds, useGbSizePx };
