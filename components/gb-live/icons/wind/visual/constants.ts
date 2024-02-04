export const MAX_SIZE_PX_TO_CAPACITY_RATIO = 0.5;

export const MINIMUM_HEIGHT_PX = 3;
export const MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO = 0.065;
export const ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO = 0.1;
export const WIND_TURBINE_COLOR = "black";

export const BALANCING_DIRECTION_LIGHT_R_TO_WIDTH_RATIO = 2.5;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const BLADE_OFFSET_ANGLES = [0, 120, 240].map(degreesToRadians);
export const PI_TIMES_2 = Math.PI * 2;
