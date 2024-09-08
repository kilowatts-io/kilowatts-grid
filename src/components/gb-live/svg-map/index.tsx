import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import calculateMinScale from "./calcs/min-scale";
import { initialSvgMapContext, SvgMapContext } from "../../../contexts/svg-map";
import * as h from "./hooks";
import GvSvgPath from "./path";
import searchPoint from "./search-point";
import { selectors } from "@/src/state/live";
import * as c from "@/src/constants";
import { ForeignFlag } from "@/src/atoms/flags";
import * as i from "@/src/components/icons";
import { useDataContext } from "@/src/contexts/data";

export const SvgMap: React.FC = () => {
  const { foreign_markets, unit_groups } = useDataContext().data.map;

  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  const screen = useWindowDimensions();
  const context = initialSvgMapContext(screen);
  const { zoomPan } = context;
  const transformD = h.useTransformD(context);

  const selectedUnitGroupPoint = React.useMemo(() => {
    if (!selectedUnitGroupCode) return;
    const match = unit_groups.find(
      ({ code }) => code === selectedUnitGroupCode
    );
    return match ? match.point : undefined;
  }, [selectedUnitGroupCode]);

  React.useEffect(() => {
    if (!context.zoomPan) return;
    const unitGroup = unit_groups.find((p) => p.code === selectedUnitGroupCode);
    if (!unitGroup) return;
    context.zoomPan.value = {
      scale: context.zoomPan.value.scale,
      translateX:
        screen.width / 2 - unitGroup.point.x * context.zoomPan.value.scale,
      translateY:
        screen.height / 2 - unitGroup.point.y * context.zoomPan.value.scale,
    };
  }, [selectedUnitGroupCode]);

  const gesture = Gesture.Race(
    Gesture.Pinch()
      .onBegin(() => context.gestureMode.value === "pan")
      .onEnd(() => (context.gestureMode.value = "none"))
      .onChange(({ focalX, focalY, scale }) => {
        const adjustedScale = 1 + (scale - 1) * c.PINCH_DAMPENING_FACTOR;
        if (!zoomPan) return;
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
          translateY,
        };
      }),
    Gesture.Pan()
      .onBegin(() => context.gestureMode.value === "pan")
      .onEnd(() => (context.gestureMode.value = "none"))
      .onChange(({ changeX, changeY }) => {
        if (!zoomPan) return;

        const scale = zoomPan.value.scale;
        if (scale < calculateMinScale(screen) || isNaN(scale)) return;
        const translateX = zoomPan.value.translateX + changeX;
        if (isNaN(translateX)) return;
        const translateY = zoomPan.value.translateY + changeY;
        if (isNaN(translateY)) return;
        zoomPan.value = {
          translateX,
          translateY,
          scale,
        };
      }),
    Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(
        ({ x, y }) =>
          zoomPan &&
          runOnJS(searchPoint)(
            {
              x: (x - zoomPan.value.translateX) / zoomPan.value.scale,
              y: (y - zoomPan.value.translateY) / zoomPan.value.scale,
            },
            unit_groups
          )
      )
  );

  return (
    <View style={styles.mapView}>
      <GestureDetector gesture={gesture}>
        <Canvas style={styles.canvas}>
          <Group transform={transformD}>
            <GvSvgPath />
            <SvgMapContext.Provider value={context}>
              {unit_groups.map((ug) => {
                switch (ug.fuel_type) {
                  case "wind":
                    return <i.WindMapIcon {...ug} />;
                  case "battery":
                    return <i.BatteryMapIcon {...ug} />;
                  case "solar":
                    return <i.SolarMapIcon {...ug} />;
                  case "interconnector":
                    return null;
                  default:
                    return (
                      <i.DispatchableMapIcon
                        {...(ug as DispatchableMapGeneratorIconProps)}
                      />
                    );
                }
              })}

              {selectedUnitGroupPoint && (
                <Circle
                  cx={selectedUnitGroupPoint.x}
                  cy={selectedUnitGroupPoint.y}
                  r={c.SELECTED_UNIT_GROUP_HIGHLIGHT_CIRCLE_RADIUS}
                  opacity={c.SELECTED_UNIT_GROUP_CIRCLE_OPACITY}
                  color={"lightgrey"}
                />
              )}

              {foreign_markets.map((fm) => (
                <>
                  <ForeignFlag key={fm.code} {...fm} />
                  {fm.cables.map((c) => (
                    <i.CableMapIcon key={c.code} {...c} />
                  ))}
                </>
              ))}
            </SvgMapContext.Provider>
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default SvgMap;

const styles = StyleSheet.create({
  canvas: { backgroundColor: c.MAP_BACKGROUND_COLOR, flex: 1 },
  mapView: { display: "flex", flex: 1, width: "100%" },
});
