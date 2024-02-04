import { OutputTotals, OutputTotalsWind } from "../live";

export type TotalsListOutputItem = {
  key:
    | "gas"
    | "coal"
    | "solar"
    | "nuclear"
    | "wind"
    | "hydro"
    | "battery"
    | "biomass"
    | "interconnectors";
  delta: number;
  level: number;
  capacity: number;
  balancingVolume: number;
};

const calculateWind = (w: OutputTotalsWind) => {
  const output = {
    delta: 0,
    level: 0,
    capacity: 0,
    balancingVolume: 0,
  };
  if (w.embedded) {
    output.delta += w.embedded.delta;
    output.level += w.embedded.level;
    output.capacity += w.embedded.capacity;
  }
  if (w.bm) {
    output.delta += w.bm.delta;
    output.level += w.bm.level;
    output.capacity += w.bm.capacity;
    output.balancingVolume += w.bm.balancingVolume;
  }
  return output;
};

export const calculateOutputTotals = (
  t: OutputTotals
): TotalsListOutputItem[] => {
  
  const totals: TotalsListOutputItem[] = [];
  if (t.solar) totals.push({ key: "solar", ...t.solar });
  if (t.coal) totals.push({ key: "coal", ...t.coal });
  if (t.gas) totals.push({ key: "gas", ...t.gas });
  if (t.nuclear) totals.push({ key: "nuclear", ...t.nuclear });
  if(t.battery) totals.push({ key: "battery", ...t.battery });
  if(t.biomass) totals.push({ key: "biomass", ...t.biomass });
  totals.push({ key: "wind", ...calculateWind(t.wind) });
  if (t.hydro) totals.push({ key: "hydro", ...t.hydro });
  if (t.interconnectors)
    totals.push({ key: "interconnectors", ...t.interconnectors });
  return totals.sort((a, b) => b.level - a.level);
};
