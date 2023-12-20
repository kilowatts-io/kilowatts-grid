import { FuelType } from "./types";

export const formatters = {
  mw: (x: number) => {
    if (x > 10000) {
      const gw = Math.round(x / 1000).toLocaleString();
      return `${gw} GW`;
    }

    if(x < 1) {
        const kw = Math.round(x * 1000).toLocaleString();
        return `${kw} kW`;
    }

    const value = Math.round(x * 10) / 10;

    return `${value.toLocaleString()} MW`;
  },
  fuelType: (x: FuelType) => {
    // capitalise first letter
    return x.charAt(0).toUpperCase() + x.slice(1);
  },
};
export default formatters;
