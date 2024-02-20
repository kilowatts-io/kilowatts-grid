import { ICON_LIST_HEIGHT, LIST_ICON_CX, LIST_ICON_CY } from "../list-icons";

import { DispatchableFuelType } from "./types";

export const TURBINE_WHEEL_OFFSET_ANGLE_DEGREES = [
  0, 45, 90, 135, 180, 225, 270, 315
];
export const TURBINE_COLOR = "darkgray";
export const TURBINE_WHEEEL_COLOR = "black";

export const DISPATCHABLE_ICON_COLOURS: Record<DispatchableFuelType, string> = {
  gas: "orange",
  oil: "brown",
  coal: "grey",
  nuclear: "violet",
  hydro: "turquoise",
  biomass: "limegreen"
};

export const TURBINE_SPOKE_LIST_LENGTH = (ICON_LIST_HEIGHT / 2) * 0.8;
export const TURBINE_SPOKE_LIST_WIDTH = ICON_LIST_HEIGHT / 2 / 20;
export const TURBINE_SPOKE_LIST_X = LIST_ICON_CX - TURBINE_SPOKE_LIST_WIDTH / 2;
export const TURBINE_SPOKE_LIST_Y = LIST_ICON_CY - TURBINE_SPOKE_LIST_LENGTH;
