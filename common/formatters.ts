import { FuelType } from "./types";

export const formatters = {
  mw: (x: number) => {

    if(x === 0) {return '0 MW';}

    if(x < 1 && x > -1) {
        const kw = Math.round(x * 1000).toLocaleString();
        return `${kw} kW`;
    }

    const value = Math.round(x * 100) / 100;

    return `${value.toLocaleString()} MW`;
  },
  fuelType: (x: FuelType) => {
    // capitalise first letter
    return x.charAt(0).toUpperCase() + x.slice(1);
  },
};
export default formatters;


