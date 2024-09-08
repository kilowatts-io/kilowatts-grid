export const BALANCING_COLORS = {
  bid: "red",
  offer: "green",
  none: "grey"
};

export const getBalancingDirection = (balancing_volume: number): BalancingDirection => 
  balancing_volume > 0 ? "bid" : balancing_volume < 0 ? "offer" : "none";

export const getBalancingColor = (balancing_volume: number) =>
  BALANCING_COLORS[getBalancingDirection(balancing_volume)];
