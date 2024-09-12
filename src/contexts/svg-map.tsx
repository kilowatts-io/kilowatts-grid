import React, { useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import GB_SVG_MAP, { GB_MAP_CENTER } from "../atoms/svg-map";
import { useScreen } from "../hooks/screen";

export const ZOOM_INC = 0.1;
export const DEFAULT_ZOOM = 0.65;
export const MAX_ZOOM = 4;
export const MIN_ZOOM = 0.5;
export const DEFAULT_HIGHIGHT_OPACITY = 0;

interface SvgMapContextProps {
  zoom: SharedValue<number>;
  centerLat: SharedValue<number>;
  centerLng: SharedValue<number>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  cursorHovered: SharedValue<boolean>;
  highlightOpacity: SharedValue<number>;
}

const defaultValues: SvgMapContextProps = {
  zoom: { value: DEFAULT_ZOOM } as SharedValue<number>,
  centerLat: { value: GB_MAP_CENTER.lat } as SharedValue<number>,
  centerLng: { value: GB_MAP_CENTER.lng } as SharedValue<number>,
  translationX: { value: 0 } as SharedValue<number>,
  translationY: { value: 0 } as SharedValue<number>,
  cursorHovered: { value: false } as SharedValue<boolean>,
  highlightOpacity: { value: 0 } as SharedValue<number>,
};

export const SvgMapContext =
  React.createContext<SvgMapContextProps>(defaultValues);

export const useSvgMapContext = () => useContext(SvgMapContext);

interface SvgMapContextValueProps {
  zoom?: number;
  centerLat?: number;
  centerLng?: number;
}

const useScreenDims = () => {
  const { mapHeight, mapWidth } = useScreen();

  return { height: mapHeight.value, width: mapWidth.value };
}

const useDefaultFullScreenZoom = () => {

  const screenDims = useScreenDims();
  const mapDims = GB_SVG_MAP.dims;

  const zoomX = screenDims.width / mapDims.width;
  const zoomY = screenDims.height / mapDims.height;
  const zoom = Math.min(zoomX, zoomY);

   return  zoom - ZOOM_INC
};

/**
 * Calculate the translations needed to center the map
 */
const useCalculateTransactions = (
  zoom: number,
) => {
  const mapDims = GB_SVG_MAP.dims;
  const screenDims = useScreenDims();

  const translationX = (screenDims.width - mapDims.width * zoom) / 2;
  const translationY = (screenDims.height - mapDims.height * zoom) / 2;

  return {
    translationX,
    translationY,
  };
};

export const useSvgMapContextValue = (options: SvgMapContextValueProps) => {
  const zoom = options.zoom || useDefaultFullScreenZoom();
  const { translationX, translationY } = useCalculateTransactions(zoom);

  return {
    zoom: useSharedValue(zoom),
    centerLat: useSharedValue(options.centerLat || GB_MAP_CENTER.lat),
    centerLng: useSharedValue(options.centerLng || GB_MAP_CENTER.lng),
    translationX: useSharedValue(translationX),
    translationY: useSharedValue(translationY),
    cursorHovered: useSharedValue(false),
    highlightOpacity: useSharedValue(DEFAULT_HIGHIGHT_OPACITY),
  };
};