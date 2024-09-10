import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { PI_TIMES_2 } from "@/src/constants";

type CycleSeconds = SharedValue<number | null>;

export const useGetBladeTransformMap = (
  offsetAngleRadians: number,
  cycleSeconds: CycleSeconds,
  t: SharedValue<number>,
) => {
  return useDerivedValue(
    () =>
      !cycleSeconds.value ||
      cycleSeconds.value == 0
        ? [{ rotate: offsetAngleRadians }]
        : [
            {
              rotate:
                (t.value / 1000 / cycleSeconds.value) * PI_TIMES_2 +
                offsetAngleRadians,
            },
          ],
    [],
  );
};

export const useGetBladeTransformList = (
  offsetAngleRadians: number,
  cycleSeconds: number | null,
  t: SharedValue<number>,
) => {
  return useDerivedValue(
    () =>
      !cycleSeconds || cycleSeconds == 0
        ? [{ rotate: offsetAngleRadians }]
        : [
            {
              rotate:
                (t.value / 1000 / cycleSeconds) * PI_TIMES_2 +
                offsetAngleRadians,
            },
          ],
    [],
  );
};
