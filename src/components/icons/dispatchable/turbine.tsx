import React from "react";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Circle, Rect, useClock } from "@shopify/react-native-skia";
import * as c from "@/src/constants";

export type TurbineWheelProps = {
  point: CanvasPoint;
  height: number;
  capacityFactor: number;
  cycleSeconds: number
  backgroundColor: string;
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
  const x = useDerivedValue(() => centerPoint.x - width / 2);
  const y = useDerivedValue(() => centerPoint.y - length);

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

export const TurbineWheelMap: React.FC<TurbineWheelProps> = (p) => {
  const opacity = 0.3 + 0.7 * p.capacityFactor;
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if(!p.cycleSeconds) return
    rotation.value = withRepeat(
      withTiming(360, { duration: p.cycleSeconds * 1000 }),
      -1,
      false,
    );
  }, [p.cycleSeconds]);

  const r = p.height / 2;
  const turbineLength = (p.height / 2) * 0.8;
  const turbineWidth = p.height / 2 / 20;

  return (
    <>
      <Circle
        cx={p.point.x}
        cy={p.point.y}
        r={r}
        color={p.backgroundColor}
        opacity={opacity}
      />
      {c.TURBINE_WHEEL_OFFSET_ANGLE_DEGREES.map((offsetAngleDegrees) => (
        <TurbineSpokeMap
          key={`wind-${p.point.x}-${p.point.y}-${offsetAngleDegrees}`}
          centerPoint={p.point}
          length={turbineLength}
          width={turbineWidth}
          cycleSeconds={p.cycleSeconds}
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
        x: c.LIST_ICON_CX,
        y: c.LIST_ICON_CY,
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
        cx={c.LIST_ICON_CX}
        cy={c.LIST_ICON_CY}
        r={c.ICON_LIST_HEIGHT / 2}
        color={backgroundColor}
        opacity={1}
      />
      {c.TURBINE_WHEEL_OFFSET_ANGLE_DEGREES.map((offsetAngleDegrees) => (
        <TurbineSpokeList
          key={`turbine-list-${offsetAngleDegrees}`}
          cycleSeconds={cycleSeconds}
          offsetAngleDegrees={offsetAngleDegrees}
        />
      ))}
    </>
  );
};
