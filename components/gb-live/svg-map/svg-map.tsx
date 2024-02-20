import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";

import { useGbSummaryOutputQuery } from "../../../state/apis/cloudfront/api";
import { selectors } from "../../../state/gb/live";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
  calculateCycleSeconds
} from "../../../state/utils";
import { BatteryMapIcon } from "../icons/battery/map-icon";
import { Cable } from "../icons/cables/cable";
import { ForeignFlag } from "../icons/cables/foreign-market-cable";
import { calculateSizePx } from "../icons/calcs";
import { DISPATCHABLE_ICON_COLOURS } from "../icons/dispatchable/constants";
import { DispatchableMapIcon } from "../icons/dispatchable/map-icon";
import SolarMapIcon from "../icons/solar/map-icon";
import { WindMapIcon } from "../icons/wind/map-icon";

import calculateMinScale from "./calcs/min-scale";
import calculatePoint from "./calcs/point";
import * as c from "./constants";
import { PINCH_DAMPENING_FACTOR } from "./constants";
import { initialMapContext, MapContext } from "./context";
import * as h from "./hooks";
import GvSvgPath from "./path";
import searchPoint from "./search-point";

export const SvgMap: React.FC = () => {
  const { data } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 60 * 1000
  });
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  const screen = useWindowDimensions();
  const context = initialMapContext(screen);
  const { zoomPan } = context;
  const transformD = h.useTransformD(context);
  const generatorMapPoints = React.useMemo(() => {
    if (!data || !data.generators) return [];
    return data.generators.map((g) => ({
      key: g.key,
      point: calculatePoint(g.coords),
      fuel_type: g.fuel_type,
      sizePx: calculateSizePx(g.cp),
      cycleSeconds: calculateCycleSeconds(g),
      capacityFactor: calculateCapacityFactor(g),
      balancing: calculateBalancingDirection(g)
    }));
  }, [data]);
  const selectedUnitGroupPoint = React.useMemo(() => {
    if (!selectedUnitGroupCode) return;
    const match = generatorMapPoints.find(
      (p) => p.key === selectedUnitGroupCode
    );
    return match ? match.point : undefined;
  }, [selectedUnitGroupCode]);

  React.useEffect(() => {
    const unitGroup = generatorMapPoints.find(
      (p) => p.key === selectedUnitGroupCode
    );
    if (!unitGroup) return;
    if (!context.zoomPan) return;
    context.zoomPan.value = {
      scale: context.zoomPan.value.scale,
      translateX:
        screen.width / 2 - unitGroup.point.x * context.zoomPan.value.scale,
      translateY:
        screen.height / 2 - unitGroup.point.y * context.zoomPan.value.scale
    };
  }, [selectedUnitGroupCode]);

  const gesture = Gesture.Race(
    Gesture.Pinch()
      .onBegin(() => context.gestureMode.value === "pan")
      .onEnd(() => (context.gestureMode.value = "none"))
      .onChange(({ focalX, focalY, scale }) => {
        const adjustedScale = 1 + (scale - 1) * PINCH_DAMPENING_FACTOR;
        const newScale = adjustedScale * zoomPan.value.scale;
        if (
          isNaN(newScale) ||
          newScale > c.MAX_SCALE ||
          newScale < calculateMinScale(screen)
        )
          return;
        const scaleChangeFactor = newScale / zoomPan.value.scale;
        if (isNaN(scaleChangeFactor)) return;
        const translateX =
          focalX - (focalX - zoomPan.value.translateX) * scaleChangeFactor;
        if (isNaN(translateX)) return;
        const translateY =
          focalY - (focalY - zoomPan.value.translateY) * scaleChangeFactor;
        if (isNaN(translateY)) return;
        zoomPan.value = {
          scale: newScale,
          translateX,
          translateY
        };
      }),
    Gesture.Pan()
      .onBegin(() => context.gestureMode.value === "pan")
      .onEnd(() => (context.gestureMode.value = "none"))
      .onChange(({ changeX, changeY }) => {
        const scale = zoomPan.value.scale;
        if (scale < calculateMinScale(screen) || isNaN(scale)) return;
        const translateX = zoomPan.value.translateX + changeX;
        if (isNaN(translateX)) return;
        const translateY = zoomPan.value.translateY + changeY;
        if (isNaN(translateY)) return;
        zoomPan.value = {
          translateX,
          translateY,
          scale
        };
      }),
    Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(({ x, y }) =>
        runOnJS(searchPoint)(
          {
            x: (x - zoomPan.value.translateX) / zoomPan.value.scale,
            y: (y - zoomPan.value.translateY) / zoomPan.value.scale
          },
          generatorMapPoints
        )
      )
  );

  return (
    <View style={styles.mapView}>
      <GestureDetector gesture={gesture}>
        <Canvas style={styles.canvas}>
          <Group transform={transformD}>
            <GvSvgPath />
            <MapContext.Provider value={context}>
              {selectedUnitGroupPoint && (
                <Circle
                  cx={selectedUnitGroupPoint.x}
                  cy={selectedUnitGroupPoint.y}
                  r={10}
                  opacity={0.4}
                  color={"lightgrey"}
                />
              )}
              {data && (
                <>
                  {data.foreign_markets.map((f) => {
                    const foreignPoint = calculatePoint(f.coords);
                    return (
                      <>
                        <ForeignFlag
                          point={foreignPoint}
                          code={f.key}
                          key={`foreign-flag-${f.key}`}
                        />
                        <>
                          {f.interconnectors.map((i) => {
                            const cycleSeconds = calculateCycleSeconds(i);
                            const width = calculateSizePx(i.cp);
                            const from = calculatePoint(i.coords);
                            return (
                              <Cable
                                from={from}
                                to={foreignPoint}
                                cycleSeconds={cycleSeconds}
                                width={width}
                                isExport={i.ac > 0}
                                key={`cable-${i.key}`}
                              />
                            );
                          })}
                        </>
                      </>
                    );
                  })}
                  {generatorMapPoints.map(
                    ({
                      point,
                      sizePx,
                      balancing,
                      cycleSeconds,
                      capacityFactor,
                      fuel_type,
                      key
                    }) => {
                      switch (fuel_type) {
                        case "wind":
                          return (
                            <WindMapIcon
                              balancing={balancing}
                              point={point}
                              sizePx={sizePx}
                              cycleSeconds={cycleSeconds}
                              key={`wind-${key}`}
                            />
                          );

                        case "battery":
                          return (
                            <BatteryMapIcon
                              point={point}
                              maxSizePx={sizePx}
                              cycleSeconds={cycleSeconds}
                              capacityFactor={capacityFactor}
                              key={`batt-${key}`}
                            />
                          );

                        case "solar":
                          return (
                            <SolarMapIcon
                              point={point}
                              sizePx={sizePx}
                              cycleSeconds={cycleSeconds}
                              capacityFactor={capacityFactor}
                              key={`batt-${key}`}
                              balancing={balancing}
                            />
                          );
                        default:
                          return (
                            <DispatchableMapIcon
                              sizePx={sizePx}
                              capacityFactor={capacityFactor}
                              point={point}
                              balancing={balancing}
                              backgroundColor={
                                DISPATCHABLE_ICON_COLOURS[fuel_type]
                              }
                              cycleSeconds={cycleSeconds}
                              key={`dispatchable-${fuel_type}-${key}`}
                            />
                          );
                      }
                    }
                  )}
                </>
              )}
            </MapContext.Provider>
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default SvgMap;

const styles = StyleSheet.create({
  canvas: { backgroundColor: c.BACKGROUND_COLOR, flex: 1 },
  mapView: { display: "flex", flex: 1, width: "100%" }
});
