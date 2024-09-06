import { createContext } from "react";
import { ScaledSize } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";

import getInitialZoomPanSharedValueState from "./calcs/initial-zoom-pan";

export type GestureMode = "none" | "pan" | "pinch";
export type GestureModeSharedValue = SharedValue<GestureMode>;
export type ZoomPanSharedValueState = {
  translateX: number;
  translateY: number;
  scale: number;
};

export type ZoomPanSharedValue = SharedValue<ZoomPanSharedValueState>;

// overall context

export type MapContextState = {
  screen: ScaledSize;
  zoomPan?: ZoomPanSharedValue;
  gestureMode: GestureModeSharedValue;
};

export const initialMapContext = (screen): MapContextState => ({
  screen,
  gestureMode: useSharedValue("none"),
  zoomPan: useSharedValue(getInitialZoomPanSharedValueState(screen)),
});

export const MapContext = createContext<MapContextState>({
  screen: { width: 0, height: 0, scale: 1 },
  gestureMode: { value: "none" },
  zoomPan: { value: { translateX: 0, translateY: 0, scale: 1 } },
} as any);
