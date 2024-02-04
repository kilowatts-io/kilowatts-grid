

export const BALANCING_COLORS = {
    bid: "red",
    offer: "green",
    none: "grey",
};
  
export const getBalancingColor = (
    balancing: "bid" | "offer" | "none"
) => BALANCING_COLORS[balancing];