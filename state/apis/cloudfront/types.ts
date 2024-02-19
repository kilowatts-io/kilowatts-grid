enum FuelType {
  gas = "gas",
  coal = "coal",
  nuclear = "nuclear",
  wind = "wind",
  solar = "solar",
  hydro = "hydro",
  biomass = "biomass",
  oil = "oil",
  other = "other"
}
interface Coords {
  lat: number;
  lng: number;
}

interface GbSummaryBaseValues {
  bids: number;
  offers: number;
  cp: number;
  ac: number;
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

interface GbSummaryOutputForeignMarket {
  key: string;
  coords: Coords;
  interconnectors: GbSummaryOutputInterconnector[];
}
interface GbSummaryOutputResponse {
  dt: string;
  totals: GbSummaryOutputTotal[];
  generators: GbSummaryOutputGenerator[];
  foreign_markets: GbSummaryOutputForeignMarket[];
}
