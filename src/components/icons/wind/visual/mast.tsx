import React from "react";
import { useDerivedValue } from "react-native-reanimated";
import { RoundedRect } from "@shopify/react-native-skia";
import * as c from "@/src/constants";

export const WindTurbineMastMap: React.FC<{
  point: { x: number; y: number };
  sizePx: number;
}> = ({ point, sizePx }) => {
  const height = Math.max(sizePx, c.MINIMUM_HEIGHT_PX);

  const mastR = useDerivedValue(
    () => height * c.ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO,
    [height]
  );

  const mastWidth = useDerivedValue(
    () => c.MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * height,
    [height]
  );

  return (
    <RoundedRect
      r={mastR}
      x={point.x}
      y={point.y}
      width={mastWidth}
      height={height}
      color={c.WIND_TURBINE_COLOR}
      opacity={1}
    />
  );
};

export const WindTurbineMastList: React.FC = () => (
  <RoundedRect
    r={c.ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * c.ICON_LIST_HEIGHT}
    x={c.LIST_ICON_CX}
    y={c.LIST_ICON_CY}
    width={c.MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * c.ICON_LIST_HEIGHT}
    height={c.ICON_LIST_HEIGHT}
    color={c.WIND_TURBINE_COLOR}
    opacity={1}
  />
);
