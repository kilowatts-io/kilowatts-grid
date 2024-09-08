

// data
export const STALE_THRESHOLD_MINUTES = 10;
export const DATA_REFRESH_INTERVAL_MS = 60 * 1000;

export const ICON_LIST_WIDTH = 20;
export const ICON_LIST_HEIGHT = 20;

export const LIST_ICON_DIMS = {
  height: ICON_LIST_HEIGHT,
  width: ICON_LIST_WIDTH,
};

export const LIST_ICON_CY = LIST_ICON_DIMS.height / 2;
export const LIST_ICON_CX = LIST_ICON_DIMS.width / 2;

export const LIST_ICON_CENTER_POINT = { x: LIST_ICON_CX, y: LIST_ICON_CY };

export const LIST_ICON_BALANCING_LIGHT_R = 8.5;


export const LIST_ITEM_ICON_SIZE = 20;

export const listItemIconStyles = {
  width: LIST_ITEM_ICON_SIZE,
  height: LIST_ITEM_ICON_SIZE,
};


// cycle seconds

export const CYCLE_SECONDS = 1/300



// map

export const MAP_BACKGROUND_COLOR = "lightblue";
export const MAX_SCALE = 16.0;
export const SCREEN_MARGIN_PIXELS = 125;
export const PINCH_DAMPENING_FACTOR = 0.25; // Adjust this value as needed
export const GB_SVG_DIM_EXTRA_MARGIN_HEIGHT = 0;
export const GB_SVG_DIM_EXTRA_MARGIN_WIDTH = GB_SVG_DIM_EXTRA_MARGIN_HEIGHT;

export const SELECTED_UNIT_GROUP_HIGHLIGHT_CIRCLE_RADIUS = 10;
export const SELECTED_UNIT_GROUP_CIRCLE_OPACITY = 0.4;

// cables

export const CABLE_LENGTH_TO_CYCLE_SECONDS_RATIO = 1 / 300;
export const CABLE_COLOR = "black";
export const ELECTRON_COLOR = "yellow";
export const CABLE_OPACITY = 0.3;
export const FLAG_WIDTH = 20;
export const FLAG_HEIGHT = 20;

export const FLAG_COLORS = {
  red: "#CE1126",
  white: "#FFFFFF",
  blue: "#002654",
  eublue: "#003399",
  orange: "#fdda25",
  black: "#000000",
  green: "#169b62",
  yellow: "#FFCE00",
};


// battery 

export const BATTERY_R_TO_HEIGHT_RATIO = 0.1;
export const BATTERY_BASE_WIDTH_FRACTION = 0.8;
export const BATTERY_TERMINAL_WIDTH_FRACTION = 1 - BATTERY_BASE_WIDTH_FRACTION;

export const BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO = 0.05;

export const BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO = 0.3;

export const calculateBatteryTerminalTop = (
  batteryHeight: number,
  terminalHeight: number,
) => {
  "worklet";
  return (batteryHeight - terminalHeight) / 2;
};

// battery list icon

export const BATTERY_ROUNDEDNESS = ICON_LIST_HEIGHT * BATTERY_R_TO_HEIGHT_RATIO;
export const BATTERY_WIDTH = ICON_LIST_WIDTH * BATTERY_BASE_WIDTH_FRACTION;
export const BATTERY_TERMINAL_WIDTH =
  ICON_LIST_WIDTH * BATTERY_TERMINAL_WIDTH_FRACTION;

export const BATTERY_TERMINAL_HEIGHT =
  ICON_LIST_HEIGHT * BATTERY_TERMINAL_WIDTH_TO_HEIGHT_RATIO;
export const BATTERY_TERMINAL_TOP = calculateBatteryTerminalTop(
  ICON_LIST_HEIGHT,
  BATTERY_TERMINAL_HEIGHT,
);
export const BATTERY_STROKE_WIDTH =
  BATTERY_STROKE_WIDTH_TO_HEIGHT_RATIO * ICON_LIST_HEIGHT;



// wind

export const MAX_SIZE_PX_TO_CAPACITY_RATIO = 0.5;

export const MINIMUM_HEIGHT_PX = 3;
export const MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO = 0.065;
export const ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO = 0.1;
export const WIND_TURBINE_COLOR = "black";

export const BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO = 2.5;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const BLADE_OFFSET_ANGLES = [0, 120, 240].map(degreesToRadians);
export const PI_TIMES_2 = Math.PI * 2;


// dispatchable


export const TURBINE_WHEEL_OFFSET_ANGLE_DEGREES = [
  0, 45, 90, 135, 180, 225, 270, 315,
];
export const TURBINE_COLOR = "darkgray";
export const TURBINE_WHEEEL_COLOR = "black";

export const DISPATCHABLE_ICON_COLOURS: Record<FuelType, string> = {
  gas: "orange",
  oil: "brown",
  coal: "grey",
  nuclear: "violet",
  hydro: "turquoise",
  biomass: "limegreen",
  wind: "skyblue",
  battery: "blue",
  solar: "yellow",
  interconnector: "black",
};

export const TURBINE_SPOKE_LIST_LENGTH = (ICON_LIST_HEIGHT / 2) * 0.8;
export const TURBINE_SPOKE_LIST_WIDTH = ICON_LIST_HEIGHT / 2 / 20;
export const TURBINE_SPOKE_LIST_X = LIST_ICON_CX - TURBINE_SPOKE_LIST_WIDTH / 2;
export const TURBINE_SPOKE_LIST_Y = LIST_ICON_CY - TURBINE_SPOKE_LIST_LENGTH;

// solar

export const SUN_COLOR = "#FDB813";

// export const MAX_SIZE_PX_TO_CAPACITY_RATIO = 0.5;
// export const MINIMUM_HEIGHT_PX = 3;
// export const MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO = 0.065;
// export const BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO = 2.5;


// lists

export const WEB_PAGINATION_LIST_COUNT = 15;


// icons

export const BALANCING_DIRECTION_LIGHT_R = 0.5;