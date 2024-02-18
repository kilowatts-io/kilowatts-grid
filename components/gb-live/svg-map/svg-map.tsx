import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Button } from "@rneui/base";
import { Card, Divider, Icon, Text } from "@rneui/themed";
import { Canvas, Group } from "@shopify/react-native-skia";

import { selectors } from "../../../state/gb/live";

import calculateMinScale from "./calcs/min-scale";
import * as c from "./constants";
import { PINCH_DAMPENING_FACTOR } from "./constants";
import { initialMapContext, MapContext } from "./context";
import * as h from "./hooks";
import GeneratorIcons from "./icons";
import GvSvgPath from "./path";
import searchPoint, { unitGroupMapPointDict } from "./search-point";

export const SvgMapLoaded: React.FC = () => {
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  const screen = useWindowDimensions();
  const context = initialMapContext(screen);
  const { zoomPan } = context;
  const transformD = h.useTransformD(context);

  React.useEffect(() => {
    const point = unitGroupMapPointDict[selectedUnitGroupCode];
    if (!point) return;
    if (!context.zoomPan) return;
    context.zoomPan.value = {
      scale: context.zoomPan.value.scale,
      translateX: screen.width / 2 - point.x * context.zoomPan.value.scale,
      translateY: screen.height / 2 - point.y * context.zoomPan.value.scale,
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
        }),
      ),
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
interface SvgMapLoadingViewProps {
  refetch: () => void;
}

const Spacer = () => <View style={{ height: 10 }} />;
const SvgMapLoadingView: React.FC<SvgMapLoadingViewProps> = ({ refetch }) => (
  <View style={styles.loadingView}>
    <Card>
      <Card.Title>Loading</Card.Title>

      <Text>
        Downloading and updating cache of hundreds of power sources around GB,
        including wind, gas, solar, hydro and interconnectors.
      </Text>
      <Spacer />
      <ActivityIndicator size="large" color="grey" />
      <Spacer />

      <Text>
        This can take a while, especially for the first time, on older devices
        and with a poor internet connection.
      </Text>
      <Spacer />

      <Button
        onPress={refetch}
        title="Retry"
        iconPosition="right"
        icon={<Icon name="refresh" color="white" />}
      />
    </Card>
  </View>
);

interface SvgMapProps {
  refetch: () => void;
}
const SvgMap: React.FC<SvgMapProps> = ({ refetch }) => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  return !initialLoadComplete ? (
    <SvgMapLoadingView refetch={refetch} />
  ) : (
    <SvgMapLoaded />
  );
};

export default SvgMap;

const styles = StyleSheet.create({
  canvas: { backgroundColor: c.BACKGROUND_COLOR, flex: 1 },
  loadingView: {
    alignItems: "center",
    backgroundColor: c.BACKGROUND_COLOR,
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  mapView: { display: "flex", flex: 1, width: "100%" },
});
