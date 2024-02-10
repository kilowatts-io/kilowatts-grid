import React, { useContext } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { RoundedRect } from "@shopify/react-native-skia";

import { MapContext } from "../../../svg-map/context";
import { ICON_LIST_HEIGHT, LIST_ICON_CX, LIST_ICON_CY } from "../../list-icons";

import {
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  MINIMUM_HEIGHT_PX,
  ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO,
  WIND_TURBINE_COLOR
} from "./constants";

export const WindTurbineMastMap: React.FC<{
  point: { x: number; y: number };
  sizePx: SharedValue<number>;
}> = ({ point, sizePx }) => {
  const height = useDerivedValue(
    () => Math.max(sizePx.value, MINIMUM_HEIGHT_PX),
    [sizePx]
  );

  const mastR = useDerivedValue(
    () => height.value * ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO,
    [height]
  );
  const mastWidth = useDerivedValue(
    () => MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * height.value,
    [height]
  );
  return (
    <RoundedRect
      r={mastR}
      x={point.x}
      y={point.y}
      width={mastWidth}
      height={height}
      color={WIND_TURBINE_COLOR}
      opacity={1}
    />
  );
};

export const WindTurbineMastList: React.FC = () => (
  <RoundedRect
    r={ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * ICON_LIST_HEIGHT}
    x={LIST_ICON_CX}
    y={LIST_ICON_CY}
    width={MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * ICON_LIST_HEIGHT}
    height={ICON_LIST_HEIGHT}
    color={WIND_TURBINE_COLOR}
    opacity={1}
  />
);
