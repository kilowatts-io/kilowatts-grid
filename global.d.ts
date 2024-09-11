interface Output {
  level: number;
  delta: number;
}

interface Coords {
  lat: number;
  lng: number;
}

interface PointInTime {
  output: Output;
  capacity: number;
  coords: Coords;
  balancing_volume: number;
}

interface UnitGroupPointInTime extends PointInTime {
  code: string;
  name: string;
  fuel_type: FuelType;
}

type DispatchableFuelType =
  | "gas"
  | "oil"
  | "coal"
  | "nuclear"
  | "hydro"
  | "biomass";

type FuelType =
  | "gas"
  | "hydro"
  | "nuclear"
  | "wind"
  | "coal"
  | "oil"
  | "battery"
  | "interconnector"
  | "solar"
  | "biomass"
  

interface FuelTypePointInTime extends PointInTime {
  code: FuelType;
  // fuel_type: FuelType;
}

interface InterconnectorPointInTime extends PointInTime {
  code: string;
}

type ForeignMarketKey = "fr" | "be" | "nl" | "dk" | "no" | "ie";

interface ForeignMarketPointInTime extends PointInTime {
  coords: Coords;
  code: ForeignMarketKey;
  interconnectors: InterconnectorPointInTime[];
}

interface BalancingTotals {
  bids: number;
  offers: number;
}

interface BackendData {
  dt: string;
  unit_groups: UnitGroupPointInTime[];
  fuel_types: FuelTypePointInTime[];
  foreign_markets: ForeignMarketPointInTime[];
  balancing_totals: BalancingTotals;
}


// processed, dervived data types for use in the app

interface CanvasPoint {
  x: number;
  y: number;
}

interface MapGeneratorIconProps extends PointInTime {
  code: string;
  fuel_type: FuelType;
  point: CanvasPoint;
  sizePx: SharedValue<number>;
  capacityFactor: SharedValue<number>;
  cycleSeconds: SharedValue<number>;
}


interface MapCableProps extends MapGeneratorIconProps {
  foreignMarket: MapGeneratorIconProps;
  isExport: boolean;
}

interface MapForeignMarketProps {
  code: ForeignMarketKey;
  point: CanvasPoint;
  cables: MapCableProps[];
}

interface AppListIconProps extends PointInTime {
  code: string;
  name: string;
  fuel_type: FuelType;
  capacityFactor: SharedValue<number>;
  cycleSeconds: SharedValue<number>;
  selected?: boolean;
}

interface AppMapData {
  unit_groups: MapGeneratorIconProps[];
  foreign_markets: MapForeignMarketProps[]
}

interface AppData {
  dt: string;
  map: AppMapData;
  lists: {
    fuel_types: AppListIconProps[];
    unit_groups: AppListIconProps[];
    balancing_totals: BalancingTotals
  }
}

interface DataContext {
  data: AppData;
  isLoading: boolean;
  refetch: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

type BalancingDirection = "bid" | "offer" | "none";

interface WithBalancingDirection {
  direction: BalancingDirection;
}


interface DispatchableMapGeneratorIconProps extends MapGeneratorIconProps {
  fuel_type: DispatchableFuelType;
}

// interface ListIconProps extends PointInTime {
//   cycleSeconds: SharedValue<number>;
// }

// interface DispatchableListIconProps extends ListIconProps {
//   fuel_type: DispatchableFuelType;
// }

// map and gesture context

type GestureMode = "none" | "pan" | "pinch";
type GestureModeSharedValue = SharedValue<GestureMode>;
interface ZoomPanSharedValueState {
  translateX: number;
  translateY: number;
  scale: number;
};

type ZoomPanSharedValue = SharedValue<ZoomPanSharedValueState>;

interface MapContextState  {
  s: ScaledSize;
  zP: ZoomPanSharedValue;
  gM: GestureModeSharedValue;
};


interface ScreenContextState {
  topHeightPx: number;
  bottomHeightPx: number;
}

interface SvgMap {
  dims: {
    width: number;
    height: number;
  };
  bounds: {
    west: number;
    east: number;
    south: number;
    north: number;
  };
  path: string;
}

interface Dims {
  height: SharedValue<number>;
  width: SharedValue<number>;
}

interface SvgMapProps extends AppMapData {
  highlighted?: { point: CanvasPoint };
  svgMap?: SvgMap;
  initialCenter?: Coords;
  zoom?: number;
  size: {
    height: number;
    width: number;
  };
  onTapIcon?: (index: number) => void;
  header: ScreenHeaderContext;
  listLeft?: React.ReactNode;
}

interface ScreenHeaderContext {
  title: string; // the title of the screen
  backUrl?: string; // the url to go back to - if not provided, the back button will not be shown
  headerRight?: React.ReactNode; // the right side of the header - e.g. map +/i zoom buttons
}