
export const calculateBalancingDirection = (net: number): "none" | "bid" | "offer" => {
  if (net === 0) return "none";
  if (net > 0) {
    return "offer";
  }
  return "bid";
};

interface WithCapacityFactor {
  output: Output;
  capacity: number
}

export const calculateCapacityFactor = ({ output, capacity }: WithCapacityFactor) => {
  if (capacity === 0) return 0;
  const ac = output.level;
  if (ac === 0) return 0;
  if (ac > 0) {
    return Math.min(1, ac / capacity);
  }
  return Math.max(-1, ac / capacity);
};

const CYCLE_MILISECONDS_AT_FULL_CAPACITY = 2;

export const calculateCycleSeconds = (x: WithCapacityFactor) => {
  const cf = calculateCapacityFactor(x);
  if (cf === 0) return null;
  return CYCLE_MILISECONDS_AT_FULL_CAPACITY / Math.abs(cf);
};