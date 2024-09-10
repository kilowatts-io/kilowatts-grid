import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import amplify_config from "../../amplify_outputs.json";
import * as c from "@/src/constants";

import { z } from "zod";
import { calculatePoint } from "../components/svg-map";

const OutputSchema = z.object({
  level: z.number(),
  delta: z.number(),
});

const CoordsSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const PointInTimeSchema = z.object({
  output: OutputSchema,
  capacity: z.number(),
  coords: CoordsSchema,
  balancing_volume: z.number(),
});

const UnitGroupPointInTimeSchema = PointInTimeSchema.extend({
  code: z.string(),
  name: z.string(),
  fuel_type: z.union([
    z.literal("gas"),
    z.literal("hydro"),
    z.literal("nuclear"),
    z.literal("wind"),
    z.literal("coal"),
    z.literal("oil"),
    z.literal("battery"),
    z.literal("interconnector"),
    z.literal("solar"),
    z.literal("biomass"),
  ]),
});

const FuelTypePointInTimeSchema = PointInTimeSchema.extend({
  code: z.union([
    z.literal("gas"),
    z.literal("hydro"),
    z.literal("nuclear"),
    z.literal("wind"),
    z.literal("coal"),
    z.literal("oil"),
    z.literal("battery"),
    z.literal("interconnector"),
    z.literal("solar"),
    z.literal("biomass"),
  ]),
});

const InterconnectorPointInTimeSchema = PointInTimeSchema.extend({
  code: z.string(),
});

const ForeignMarketPointInTimeSchema = z.object({
  coords: CoordsSchema,
  code: z.union([
    z.literal("fr"),
    z.literal("be"),
    z.literal("nl"),
    z.literal("dk"),
    z.literal("no"),
    z.literal("ie"),
  ]),
  interconnectors: z.array(InterconnectorPointInTimeSchema),
});

const BalancingTotalsSchema = z.object({
  bids: z.number(),
  offers: z.number(),
});

const BackendDataSchema = z.object({
  dt: z.string(),
  unit_groups: z.array(UnitGroupPointInTimeSchema),
  fuel_types: z.array(FuelTypePointInTimeSchema),
  foreign_markets: z.array(ForeignMarketPointInTimeSchema),
  balancing_totals: BalancingTotalsSchema,
});

type BackendDataFromSchema = z.infer<typeof BackendDataSchema>;
type CheckTypes = BackendData extends BackendDataFromSchema ? true : false;

export const validateData = (backendData: BackendData): boolean => {
  const result = BackendDataSchema.safeParse(backendData);
  if (result.success) {
    console.log("Data is valid");
    return true;
  } else {
    return false;
  }
};

/**
 * Calculate point on canvas
 */
const point = (p: { coords: Coords }): CanvasPoint => calculatePoint(p.coords);

/**
 * Calculate capacity factor
 * @param p PointInTime including capacity factor
 */
const capacityFactor = (p: PointInTime): number => {
  if (p.capacity === undefined) return 0;
  return Math.max(0,  Math.min(1, p.output.level / p.capacity))
};

/**
 * Calculate cycle seconds
 * @param p PointInTime including capacity factor
 * @returns number | null
 */
const cycleSeconds = (p: PointInTime): number | null => {
  const cF = capacityFactor(p);
  if (cF === 0) return null;
  // if the capacity factor is 1, then return 3 seconds
  if (cF === 1) return 3;
  // OTHERWISE return a value between 3 and 10 seconds, so it takes longer if the capacity factor is lower
  return 3 + (1 - cF) * 5;
};

/**
 * Calculate size in pixels
 * @param p PointInTime
 * @returns number
 */
const sizePx = {
  mapIcon: (p: PointInTime, scaler?: number): number => {
    return p.capacity * c.ICON_SIZE_PX_TO_CAPACITY_MW * (scaler || 1);
  },
};

const mapProps = (p: UnitGroupPointInTime) => ({
  ...p,
  point: point(p),
  sizePx: sizePx.mapIcon(p),
  capacityFactor: capacityFactor(p),
  cycleSeconds: cycleSeconds(p),
});

const mapUnitGroupIcon = (p: UnitGroupPointInTime): MapGeneratorIconProps =>
  mapProps(p);

const isExport = (p: InterconnectorPointInTime): boolean => p.output.level < 0;

const mapForeignMarket = (
  p: ForeignMarketPointInTime
): MapForeignMarketProps => {
  const foreignMarket: MapGeneratorIconProps = {
    ...p,
    point: point(p),
    sizePx: sizePx.mapIcon(p, c.FOREIGN_MARKET_ICON_SCALER),
    capacityFactor: capacityFactor(p),
    cycleSeconds: cycleSeconds(p),
    fuel_type: "interconnector",
  };
  return {
    code: p.code,
    point: point(p),
    cables: p.interconnectors.map((i) => ({
      ...i,
      fuel_type: "interconnector",
      point: point(i),
      sizePx: sizePx.mapIcon(p, c.FOREIGN_MARKET_ICON_SCALER),
      capacityFactor: capacityFactor(p),
      cycleSeconds: cycleSeconds(p),
      foreignMarket,
      isExport: isExport(i),
    })),
  };
};

// list related

const listProps = (
  p: PointInTime & {
    code: string;
    name: string;
    fuel_type: FuelType;
  }
): AppListIconProps => ({
  ...p,
  capacityFactor: capacityFactor(p),
  cycleSeconds: cycleSeconds(p),
});

const fuelTypeIcon = (p: FuelTypePointInTime): AppListIconProps =>
  listProps({
    ...p,
    name: p.code,
    fuel_type: p.code,
  });
const unitGroupIcon = (p: UnitGroupPointInTime): AppListIconProps =>
  listProps(p);


const filterZero = (p: PointInTime): boolean => p.output.level !== 0 || p.balancing_volume !== 0;
/**
 * For Lists, sort in descending order, first by level, then by capacity
 * @param a PointInTime
 * @param b PointInTime
 */
const sortDescending = (a: PointInTime, b: PointInTime) => {
  if (a.output.level === b.output.level) {
    return b.capacity - a.capacity;
  }
  return b.output.level - a.output.level;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: amplify_config.custom.API.kilowattsGridApi.endpoint,
  }),
  endpoints: (builder) => ({
    now: builder.query<AppData, void>({
      query: () => "now",
      transformResponse: (data: BackendData): Promise<AppData> => {
        const output = {
          dt: data.dt,
          map: {
            unit_groups: data.unit_groups.map(mapUnitGroupIcon),
            foreign_markets: data.foreign_markets.map(mapForeignMarket),
          },
          lists: {
            fuel_types: data.fuel_types.map(fuelTypeIcon).sort(sortDescending),
            unit_groups: data.unit_groups.map(unitGroupIcon).filter(filterZero).sort(sortDescending),
            balancing_totals: data.balancing_totals,
          },
        }
        return Promise.resolve(output);
      },
    }),
  }),
});
export default api;
export const { useNowQuery } = api;
