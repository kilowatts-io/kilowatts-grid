export const BID_COLOR = "green";
export const OFFER_COLOR = "red";
export const NEUTRAL_COLOR = "darkgrey";

/* get the shading colour for an icon */
export const getShadingColor = (balancing: "bid" | "offer" | "none") => {
  switch (balancing) {
    case "bid":
      return BID_COLOR
    case "offer":
      return OFFER_COLOR
    default:
      return NEUTRAL_COLOR
  }
};


export const calculateSize = (capacity: number) => {
  return capacity ** 0.5;
};

export const calculateBalancingDirection = (volume: number) => {
  if (volume === 0) return "none";
  return volume > 0 ? "offer" : "bid";
};


export const calculateCapacityFactor = (output: number, capacity: number) => {
  if (output > capacity) return 1;
  if (output === 0) return 0;
  // round to 2 decimal places
  const exact = output / capacity;
  return Math.round(exact * 100) / 100;
};