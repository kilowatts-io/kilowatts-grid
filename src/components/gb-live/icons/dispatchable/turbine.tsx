import React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Circle, Rect, useClock } from "@shopify/react-native-skia";

import { MapContext } from "../../svg-map/context";
import { CanvasPoint } from "../../svg-map/types";
import { ICON_LIST_HEIGHT, LIST_ICON_CX, LIST_ICON_CY } from "../list-icons";

import * as c from "./constants";

export type TurbineWheelProps = {
  point: CanvasPoint;
  height: number;
  cycleSeconds: number | null
  backgroundColor: string;
  opacity: number;
};

export type TurbineSpokeMapProps = {
  centerPoint: CanvasPoint;
  length: number;
  width: number;
  cycleSeconds: number | null
  offsetAngleDegrees: number;
  opacity: number;
};

const TurbineSpokeMap: React.FC<TurbineSpokeMapProps> = ({
  centerPoint,
  length,
  width,
  cycleSeconds,
  offsetAngleDegrees,
  opacity,
}) => {
  const t = useClock();
  const gestureMode = React.useContext(MapContext).gestureMode;
  const x = useDerivedValue(() => centerPoint.x - width / 2);
  const y = useDerivedValue(() => centerPoint.y - length);

  const transform = useDerivedValue(() => {
    if (gestureMode.value != "none" || cycleSeconds === null || cycleSeconds === 0)
      return [{ rotate: offsetAngleDegrees * (Math.PI / 180) }];
    const timeInSeconds = t.value / 1000;
    const rotationFraction = timeInSeconds / cycleSeconds;
    const anglePreOffsetRadians = rotationFraction * Math.PI * 2;
    const offsetAngleRadians = offsetAngleDegrees * (Math.PI / 180);
    const rotateRadians = anglePreOffsetRadians + offsetAngleRadians;
    return [{ rotate: rotateRadians }];
  });

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={length}
      color={c.TURBINE_WHEEEL_COLOR}
      origin={centerPoint}
      transform={transform}
      opacity={opacity}
    />
  );
};

export const TurbineWheelMap: React.FC<TurbineWheelProps> = ({
  point,
  height,
  cycleSeconds,
  backgroundColor,
  opacity,
}) => {
  const rotation = useSharedValue(0);
  const { gestureMode } = React.useContext(MapContext);

  React.useEffect(() => {
    if(!cycleSeconds) return
    rotation.value = withRepeat(
      withTiming(360, { duration: cycleSeconds * 1000 }),
      -1,
      false,
    );
  }, [cycleSeconds, gestureMode]);

  const r = height / 2;
  const turbineLength = (height / 2) * 0.8;
  const turbineWidth = height / 2 / 20;

  return (
    <>
      <Circle
        cx={point.x}
        cy={point.y}
        r={r}
        color={backgroundColor}
        opacity={opacity}
      />
      {c.TURBINE_WHEEL_OFFSET_ANGLE_DEGREES.map((offsetAngleDegrees) => (
        <TurbineSpokeMap
          key={offsetAngleDegrees}
          centerPoint={point}
          length={turbineLength}
          width={turbineWidth}
          cycleSeconds={cycleSeconds}
          offsetAngleDegrees={offsetAngleDegrees}
          opacity={opacity}
        />
      ))}
    </>
  );
};

export type TurbineSpokeListProps = {
  cycleSeconds: number | null;
  offsetAngleDegrees: number;
};

const TurbineSpokeList: React.FC<TurbineSpokeListProps> = ({
  cycleSeconds,
  offsetAngleDegrees,
}) => {
  const t = useClock();
  const transform = useDerivedValue(() => {
    if (cycleSeconds === null || cycleSeconds === 0)
      return [{ rotate: offsetAngleDegrees * (Math.PI / 180) }];
    const timeInSeconds = t.value / 1000;
    const rotationFraction = timeInSeconds / cycleSeconds;
    const anglePreOffsetRadians = rotationFraction * Math.PI * 2;
    const offsetAngleRadians = offsetAngleDegrees * (Math.PI / 180);
    const rotateRadians = anglePreOffsetRadians + offsetAngleRadians;
    return [{ rotate: rotateRadians }];
  });

  return (
    <Rect
      x={c.TURBINE_SPOKE_LIST_X}
      y={c.TURBINE_SPOKE_LIST_Y}
      width={c.TURBINE_SPOKE_LIST_WIDTH}
      height={c.TURBINE_SPOKE_LIST_LENGTH}
      color={c.TURBINE_WHEEEL_COLOR}
      origin={{
        x: LIST_ICON_CX,
        y: LIST_ICON_CY,
      }}
      transform={transform}
    />
  );
};

type TurbineWheelListProps = {
  cycleSeconds: number | null;
  backgroundColor: string;
};

export const TurbineWheelList: React.FC<TurbineWheelListProps> = ({
  cycleSeconds,
  backgroundColor,
}) => {
  return (
    <>
      <Circle
        cx={LIST_ICON_CX}
        cy={LIST_ICON_CY}
        r={ICON_LIST_HEIGHT / 2}
        color={backgroundColor}
        opacity={1}
      />
      {c.TURBINE_WHEEL_OFFSET_ANGLE_DEGREES.map((offsetAngleDegrees) => (
        <TurbineSpokeList
          key={offsetAngleDegrees}
          cycleSeconds={cycleSeconds}
          offsetAngleDegrees={offsetAngleDegrees}
        />
      ))}
    </>
  );
};
