import React from "react";
import { useClock } from "@shopify/react-native-skia";

import { WindTurbineBladeListItem, WindTurbineBladeMap } from "./blade";

import { useGetBladeTransformList } from "./hooks";
import * as c from "@/src/constants";

export const WindTurbineBladesMap: React.FC<{
  point: { x: number; y: number };
  cycleSeconds: number | null;
  sizePx: number;
}> = ({ point, cycleSeconds, sizePx }) => {
  const t = useClock();
  const height = Math.max(sizePx, c.MINIMUM_HEIGHT_PX);
  const width = height * c.MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO;
  const bladeR = c.ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * width;
  const bladeWidth = c.MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * height;
  return (
    <>
      {c.BLADE_OFFSET_ANGLES.map((x) =>
        useGetBladeTransformList(x, cycleSeconds, t),
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
  const clock = useClock();
  return (
    <>
      {c.BLADE_OFFSET_ANGLES.map((x) =>
        useGetBladeTransformList(x, cycleSeconds, clock),
      ).map((transform, index) => (
        <WindTurbineBladeListItem
          key={`blade-${index}`}
          transform={transform}
        />
      ))}
    </>
  );
};
