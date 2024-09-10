export const BALANCING_COLORS = {
  bid: "red",
  offer: "green",
  none: "grey"
};

export const getBalancingDirection = (balancing_volume: number): BalancingDirection => 
  balancing_volume === 0 ? 'none' : (balancing_volume < 0 ? "bid"  : "offer") 

export const getBalancingColor = (balancing_volume: number): string =>
  BALANCING_COLORS[getBalancingDirection(balancing_volume)];
