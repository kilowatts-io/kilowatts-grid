import React from "react";
import { useClock } from "@shopify/react-native-skia";

import { WindTurbineBladeListItem, WindTurbineBladeMap } from "./blade";
import {
  BLADE_OFFSET_ANGLES,
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  MINIMUM_HEIGHT_PX,
  ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO
} from "./constants";
import { useGetBladeTransformList } from "./hooks";

export const WindTurbineBladesMap: React.FC<{
  point: { x: number; y: number };
  cycleSeconds: number | null;
  sizePx: number;
}> = ({ point, cycleSeconds, sizePx }) => {
  const t = useClock();
  const height = Math.max(sizePx, MINIMUM_HEIGHT_PX);
  const width = height * MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO;
  const bladeR = ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * width;
  const bladeWidth = MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * height;
  return (
    <>
      {BLADE_OFFSET_ANGLES.map((x) =>
        useGetBladeTransformList(x, cycleSeconds, t)
      ).map((transform, index) => (
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
}> = ({ cycleSeconds }) => {
  const t = useClock();
  return (
    <>
      {BLADE_OFFSET_ANGLES.map((x) =>
        useGetBladeTransformList(x, cycleSeconds, t)
      ).map((transform, index) => (
        <WindTurbineBladeListItem
          key={`blade-${index}`}
          transform={transform}
        />
      ))}
    </>
  );
};
