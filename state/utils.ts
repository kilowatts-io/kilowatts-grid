interface WithBalancingVolumes {
  bids: number;
  offers: number;
}
export const calculateBalancingDirection = ({
  bids,
  offers
}: WithBalancingVolumes): "none" | "bid" | "offer" => {
  const net = bids - offers;
  if (net === 0) return "none";
  if (net > 0) {
    return "offer";
  }
  return "bid";
};

interface WithCapacityFactor {
  ac: number;
  cp: number;
}

export const calculateCapacityFactor = ({ ac, cp }: WithCapacityFactor) => {
  if (cp === 0) return 0;
  if (ac === 0) return 0;
  if (ac > 0) {
    return Math.min(1, ac / cp);
  }
  return Math.max(-1, ac / cp);
};

const CYCLE_MILISECONDS_AT_FULL_CAPACITY = 2;

export const calculateCycleSeconds = (x: WithCapacityFactor) => {
  const cf = calculateCapacityFactor(x);
  if (cf === 0) return null;
  return CYCLE_MILISECONDS_AT_FULL_CAPACITY / Math.abs(cf);
};
