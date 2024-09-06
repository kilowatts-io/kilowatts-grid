import { SharedValue } from "react-native-reanimated";

import { CanvasPoint } from "../svg-map/types";

export type Balancing = "bid" | "offer" | "none";

type BaseIconProps = {};

// map icons

export type GeneratorMapIconProps = BaseIconProps & {
  // static points that are calculated pre-runtime
  key: string;
  point: CanvasPoint;
  // dynamic points that are calculated and updated at runtime
  balancing: SharedValue<Balancing>;
  sizePx: SharedValue<number>;
  cycleSeconds: SharedValue<number>;
};

// list icons

const LIST_ITEM_ICON_SIZE = 20;

export const listItemIconStyles = {
  width: LIST_ITEM_ICON_SIZE,
  height: LIST_ITEM_ICON_SIZE,
};

export type ListItemIconProps = BaseIconProps & {
  balancing: Balancing;
  cycleSeconds: number;
  generatorType:
    | "wind"
    | "nuclear"
    | "gas"
    | "coal"
    | "biomass"
    | "hydro"
    | "battery"
    | "solar"
    | "oil"
    | "other";
};

// balancing direction light

type BalancingDirectionLightBaseProps = {
  balancing: Balancing;
};

export type BalancingDirectionLightMapMarkerProps =
  BalancingDirectionLightBaseProps & {};
export type BalanacingDirectionLightListItemIconProps =
  BalancingDirectionLightBaseProps & {};

// interconnectors

export type InterconnectorMapIconProps = {};
