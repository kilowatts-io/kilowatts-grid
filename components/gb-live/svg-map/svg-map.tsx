import { Canvas, Group } from "@shopify/react-native-skia";
import React from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MapContext, initialMapContext } from "./context";
import GvSvgPath from "./path";
import { useSelector } from "react-redux";
import { selectors } from "../../../state/gb/live";
import * as h from "./hooks";
import * as c from "./constants";
import GeneratorIcons from "./icons";
import calculateMinScale from "./calcs/min-scale";
import { PINCH_DAMPENING_FACTOR } from "./constants";
import { runOnJS } from "react-native-reanimated";
import searchPoint, { unitGroupMapPointDict } from "./search-point";

export const SvgMapLoaded: React.FC = () => {
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  const screen = useWindowDimensions();
  const context = initialMapContext(screen);
  const { zoomPan } = context;
  const transformD = h.useTransformD(context);

  React.useEffect(() => {
    const point = unitGroupMapPointDict[selectedUnitGroupCode];
    if(!point) return 
    if(!context.zoomPan) return
    context.zoomPan.value = {
      scale: context.zoomPan.value.scale,
      translateX : screen.width / 2 - point.x * context.zoomPan.value.scale,
      translateY : screen.height / 2 - point.y * context.zoomPan.value.scale
    }
  }, [selectedUnitGroupCode])

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
          translateY,
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
          scale,
        };
      }),
    Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(({ x, y }) =>
        runOnJS(searchPoint)({
          x: (x - zoomPan.value.translateX) / zoomPan.value.scale,
          y: (y - zoomPan.value.translateY) / zoomPan.value.scale,
        })
      )
  );

  return (
    <View style={styles.mapView}>
      <GestureDetector gesture={gesture}>
        <Canvas style={styles.canvas}>
          <Group transform={transformD}>
            <GvSvgPath />
            <MapContext.Provider value={context}>
              {GeneratorIcons}
            </MapContext.Provider>
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

const SvgMapLoadingView = () => (
  <View style={styles.loadingView}>
    <ActivityIndicator size="large" color="white" />
  </View>
);

const SvgMap = () => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  return !initialLoadComplete ? <SvgMapLoadingView /> : <SvgMapLoaded />;
};

export default SvgMap;

const styles = StyleSheet.create({
  mapView: { display: "flex", width: "100%", flex: 1 },
  canvas: { flex: 1, backgroundColor: c.BACKGROUND_COLOR },
  loadingView: {
    flex: 1,
    backgroundColor: c.BACKGROUND_COLOR,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
