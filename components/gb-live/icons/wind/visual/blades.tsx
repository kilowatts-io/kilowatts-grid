import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { useClock } from "@shopify/react-native-skia";
import { WindTurbineBladeListItem, WindTurbineBladeMap } from "./blade";
import {
  BLADE_OFFSET_ANGLES,
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  MINIMUM_HEIGHT_PX,
  ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO,
} from "./constants";
import { useGetBladeTransformList, useGetBladeTransformMap } from "./hooks";

export const WindTurbineBladesMap: React.FC<{
  point: { x: number; y: number };
  cycleSeconds: SharedValue<number | null>;
  sizePx: SharedValue<number>;
}> = ({ point, cycleSeconds, sizePx }) => {
  const t = useClock();
  const height = useDerivedValue(
    () => Math.max(sizePx.value, MINIMUM_HEIGHT_PX),
    [sizePx]
  );
  const width = useDerivedValue(
    () => height.value * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
    [sizePx]
  );
  const bladeR = useDerivedValue(
    () => ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * width.value,
    [width]
  );
  const bladeWidth = useDerivedValue(
    () => MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * height.value,
    [height]
  );
  return (
    <>
      {BLADE_OFFSET_ANGLES.map(x => useGetBladeTransformMap(x, cycleSeconds, t)).map((transform, index) => (
        <WindTurbineBladeMap
          key={`blade-${point.x}-${point.y}-${index}`}
          r={bladeR}
          width={bladeWidth}
          height={height}
          hubAttachmentPoint={point}
          transform={transform}
        />
      ))}
    </>
  );
};

export const WindTurbineBladesList: React.FC<{
  cycleSeconds: number | null;
}> = ({cycleSeconds}) => {
  const t = useClock();
  return (
    <>
      {BLADE_OFFSET_ANGLES.map(x => useGetBladeTransformList(x, cycleSeconds, t)).map((transform, index) => (
        <WindTurbineBladeListItem
          key={`blade-${index}`}
          transform={transform}
        />
      ))}
    </>
  );

}