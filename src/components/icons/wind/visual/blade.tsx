import React from "react";
import { SharedValue } from "react-native-reanimated";
import { RoundedRect } from "@shopify/react-native-skia";

import * as c from "@/src/constants";

type BladeProps = {
  r: number;
  width: number;
  height: number;
  hubAttachmentPoint: CanvasPoint;
  transform: Readonly<
    SharedValue<
      {
        rotate: number;
      }[]
    >
  >;
};

export const WindTurbineBladeMap: React.FC<BladeProps> = ({
  r,
  width,
  height,
  hubAttachmentPoint,
  transform,
}) => (
  <RoundedRect
    x={hubAttachmentPoint.x}
    y={hubAttachmentPoint.y}
    r={r}
    width={width}
    height={height}
    origin={hubAttachmentPoint}
    transform={transform}
    color={c.WIND_TURBINE_COLOR}
  />
);

type BladeIconProps = {
  transform: Readonly<
    SharedValue<
      {
        rotate: number;
      }[]
    >
  >;
};

export const WindTurbineBladeListItem: React.FC<BladeIconProps> = ({
  transform,
}) => (
  <RoundedRect
    x={c.LIST_ICON_CX}
    y={c.LIST_ICON_CY}
    r={c.ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * c.ICON_LIST_WIDTH}
    width={c.MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * c.ICON_LIST_WIDTH}
    height={c.ICON_LIST_HEIGHT}
    origin={{ x: c.LIST_ICON_CX, y: c.LIST_ICON_CY }}
    transform={transform}
    color={c.WIND_TURBINE_COLOR}
  />
);
