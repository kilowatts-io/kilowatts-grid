import React from "react";
import { SharedValue } from "react-native-reanimated";
import { RoundedRect } from "@shopify/react-native-skia";

import { CanvasPoint } from "../../../svg-map/types";
import {
  ICON_LIST_HEIGHT,
  ICON_LIST_WIDTH,
  LIST_ICON_CX,
  LIST_ICON_CY
} from "../../list-icons";

import {
  MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO,
  ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO,
  WIND_TURBINE_COLOR
} from "./constants";

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
  transform
}) => (
  <RoundedRect
    x={hubAttachmentPoint.x}
    y={hubAttachmentPoint.y}
    r={r}
    width={width}
    height={height}
    origin={hubAttachmentPoint}
    transform={transform}
    color={WIND_TURBINE_COLOR}
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
  transform
}) => (
  <RoundedRect
    x={LIST_ICON_CX}
    y={LIST_ICON_CY}
    r={ROUNDEDNESS_TO_OVERALL_HEIGHT_RATIO * ICON_LIST_WIDTH}
    width={MAST_AND_BLADE_WIDTH_TO_OVERALL_HEIGHT_RATIO * ICON_LIST_WIDTH}
    height={ICON_LIST_HEIGHT}
    origin={{ x: LIST_ICON_CX, y: LIST_ICON_CY }}
    transform={transform}
    color={WIND_TURBINE_COLOR}
  />
);
