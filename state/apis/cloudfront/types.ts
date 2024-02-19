type FuelType =
  | "gas"
  | "coal"
  | "nuclear"
  | "wind"
  | "solar"
  | "hydro"
  | "biomass"
  | "battery";

interface Coords {
  lat: number;
  lng: number;
}

interface GbSummaryBaseValues {
  bids: number;
  offers: number;
  cp: number;
  ac: number;
  dl: number;
  name: string;
  key: string;
}

interface GbSummaryOutputGenerator extends GbSummaryBaseValues {
  fuel_type: FuelType;
  coords: Coords;
}
interface GbSummaryOutputInterconnector extends GbSummaryBaseValues {
  coords: Coords;
}

interface GbSummaryOutputTotal extends GbSummaryBaseValues {
  name: string;
  key: FuelType;
}

export type GbSummaryForeignMarketKey = "fr" | "be" | "nl" | "dk" | "no" | "ie";

interface GbSummaryOutputForeignMarket {
  key: GbSummaryForeignMarketKey;
  coords: Coords;
  interconnectors: GbSummaryOutputInterconnector[];
}
export interface GbSummaryOutputResponse {
  dt: string;
  totals: GbSummaryOutputTotal[];
  generators: GbSummaryOutputGenerator[];
  foreign_markets: GbSummaryOutputForeignMarket[];
  balancing_totals: {
    bids: number;
    offers: number;
  };
}
