interface Output {
  level: number;
  delta: number;
}

interface Coords {
  lat: number;
  lng: number;
}

interface UnitGroup {
  output: Output;
  capacity: number;
  coords: Coords;
}

interface FuelType {
  output: Output;
  capacity: number;
}

interface Interconnector {
  output: Output;
  capacity: number;
  code: string;
}

interface ForeignMarket {
  code: string;
  output: Output;
  capacity: number;
  interconnectors: Interconnector[];
  coords: Coords;
}

interface BalancingTotals {
  bids: number;
  offers: number;
}

interface GbPointInTime {
  dt: string;
  unit_groups: Record<string, UnitGroup>;
  fuel_types: FuelType[];
  foreign_markets: ForeignMarket[];
  balancing_totals: BalancingTotals;
}
