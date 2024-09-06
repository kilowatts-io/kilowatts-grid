interface Output {
  level: number;
  delta: number;
}

interface Coords {
  lat: number;
  lng: number;
}

interface UnitGroupPointInTime {
  code: string;
  name: string;
  output: Output;
  capacity: number;
  coords: Coords;
  balancing_volume: number;
  fuel_type: FuelType
}

type FuelType = "gas"
    | "hydro"
    | "nuclear"
    | "wind"
    | "coal"
    | "oil"
    | "battery"
    | "interconnector"
    | "solar"
    | "biomass";

interface FuelTypePointInTime {
  code: FuelType;
  output: Output;
  capacity: number;
  balancing_volume: number;
}

interface InterconnectorPointInTime {
  output: Output;
  coords: Coords;
  capacity: number;
  code: string;
  balancing_volume: number;
}

type ForeignMarketKey = "fr" | "be" | "nl" | "dk" | "no" | "ie";

interface ForeignMarketPointInTime {
  code: ForeignMarketKey;
  coords: Coords;
  output: Output;
  capacity: number;
  interconnectors: InterconnectorPointInTime[];
  coords: Coords;
  balancing_volume: number;
}

interface BalancingTotals {
  bids: number;
  offers: number;
}

interface GbPointInTime {
  dt: string;
  unit_groups: UnitGroupPointInTime[]
  fuel_types: FuelTypePointInTime[];
  foreign_markets: ForeignMarketPointInTime[];
  balancing_totals: BalancingTotals;
}
