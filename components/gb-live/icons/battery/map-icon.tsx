import React from "react";
import { GeneratorMapIconProps } from "../types";
// import { Group, RoundedRect } from "@shopify/react-native-skia";
// import { BalancingDirectionLightMap } from "../balancing-direction-light/map-icon";
// import { useDerivedValue, useSharedValue } from "react-native-reanimated";
// import { MapContext } from "../../svg-map/context";

const NORMAL_BATTERY_COLOR = "grey";
const CHARGING_BATTERY_COLOR = "green";
const DISCHARGING_BATTERY_COLOR = "red";
const OPACITY_IDLE = 0.3;

const BATTERY_START_X = 5;
const BATTERY_START_Y = 10;
const BATTERY_ORIGINAL_WIDTH = 80;
const BATTERY_ORIGINAL_HEIGHT = 30;
const BATTERY_TERMINAL_HEIGHT_FRACTION = 16 / 30;

const getOpacity = (capacityFactor: number) =>
  capacityFactor === 0 ? OPACITY_IDLE : 1;

const getColor = (capacityFactor: number) => {
  if (capacityFactor === 0) return NORMAL_BATTERY_COLOR;
  if (capacityFactor < 0) return CHARGING_BATTERY_COLOR;
  return DISCHARGING_BATTERY_COLOR;
};

export const BatteryMapIcon: React.FC<GeneratorMapIconProps> = (p) => {
  return null
  // const {zoomPan} = React.useContext(MapContext);
  // const width = useDerivedValue(() => {
  //   return Math.max(8, p.maxSizePx / zoomPan.value.scale)
  // }, [])
  // const scalingFactor = useDerivedValue(() => {
  //   return width.value / BATTERY_ORIGINAL_WIDTH;
  // }, [width])
  // const opacity = getOpacity(p.capacityFactor);
  // const color = getColor(p.capacityFactor);
  // const balancingR = useSharedValue(5)

  // return (
  //   <Group
  //     transform={[
  //       { translateX: p.point.x - BATTERY_START_X },
  //       { translateY: p.point.y - BATTERY_START_Y },
  //       {
  //         scaleX: scalingFactor.value,
  //       },
  //       {
  //         scaleY: scalingFactor.value,
  //       },
  //     ]}
  //   >
  //     <RoundedRect
  //       x={BATTERY_START_X}
  //       y={BATTERY_START_Y}
  //       width={70}
  //       height={BATTERY_ORIGINAL_HEIGHT}
  //       r={5}
  //       color={color}
  //       style={"stroke"}
  //       strokeWidth={2}
  //       opacity={opacity}
  //     />
  //     <RoundedRect
  //       x={75}
  //       y={17}
  //       width={10}
  //       height={BATTERY_ORIGINAL_HEIGHT * BATTERY_TERMINAL_HEIGHT_FRACTION}
  //       r={5}
  //       color={color}
  //       opacity={opacity}
  //     />
  //     <BalancingDirectionLightMap
  //       r={balancingR}
  //       center={{x: 40, y: 25}}
  //       balancing={"offer"}
  //     />
  //   </Group>
  // );
};
