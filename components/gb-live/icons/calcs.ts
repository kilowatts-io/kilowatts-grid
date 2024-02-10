const CYCLE_MILISECONDS_AT_FULL_CAPACITY = 2;
const CYCLE_SECONDS_ROUNDING_DP = 1;

const roundCapacityFactor = (exact: number) => {
  return (
    (exact * 10 ** CYCLE_SECONDS_ROUNDING_DP) / 10 ** CYCLE_SECONDS_ROUNDING_DP
  );
};

export const calculateCycleSeconds = (capacityFactor: number) => {
  if (capacityFactor == 0) return null;
  const exact = CYCLE_MILISECONDS_AT_FULL_CAPACITY / capacityFactor;
  const rounded = roundCapacityFactor(exact);
  return rounded;
};

export const calculateCycleSecondsInterconnector = (
  capacity: number,
  output: {
    level: number;
    delta: number;
  } | null
): number | null => {
  if (!output || output.level === 0) return null;
  const capacityFactor =
    output.level < 0
      ? Math.max(-1, output.level / capacity)
      : Math.min(output.level / capacity, 1);
  return calculateCycleSeconds(capacityFactor);
};

const SIZE_PX_PER_MW_CAPACITY = 0.0125;
export const calculateSizePx = (capacity: number) =>
  Math.round(capacity * SIZE_PX_PER_MW_CAPACITY);
