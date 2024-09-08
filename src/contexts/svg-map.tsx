import { createContext } from "react";
import { ScaledSize, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import getInitialZoomPanSharedValueState from "../components/gb-live/svg-map/calcs/initial-zoom-pan";
import React from "react";

export const initialSvgMapContext = (screen: ScaledSize): MapContextState => ({
  screen,
  gestureMode: useSharedValue("none"),
  zoomPan: useSharedValue(getInitialZoomPanSharedValueState(screen)),
});

export const SvgMapContext = createContext<MapContextState>({
  screen: { width: 0, height: 0, scale: 1 },
  gestureMode: { value: "none" },
  zoomPan: { value: { translateX: 0, translateY: 0, scale: 1 } },
} as any);


export const SvgMapProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const screen = useWindowDimensions();
  const value = initialSvgMapContext(screen);
  return <SvgMapContext.Provider value={value}>{children}</SvgMapContext.Provider>;
}

export const useSvgMapContext = () => {
  return React.useContext(SvgMapContext);
}