import React, { useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { GB_MAP_CENTER } from "../atoms/svg-map";

export const ZOOM_INC = 0.1;
export const DEFAULT_ZOOM = 0.65;
export const MAX_ZOOM = 4;
export const MIN_ZOOM = 0.5;
export const DEFAULT_HIGHIGHT_OPACITY = 0

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

export const SvgMapContext = React.createContext<SvgMapContextProps>(defaultValues);


export const useSvgMapContext = () => useContext(SvgMapContext);

export const useSvgMapContextValue = (
    zoom: number = DEFAULT_ZOOM,
    centerLat: number = GB_MAP_CENTER.lat,
    centerLng: number = GB_MAP_CENTER.lng,
) => ({
    zoom: useSharedValue(zoom),
    centerLat: useSharedValue(centerLat),
    centerLng: useSharedValue(centerLng),
    translationX: useSharedValue(0),
    translationY: useSharedValue(0),
    cursorHovered: useSharedValue(false),
    highlightOpacity: useSharedValue(DEFAULT_HIGHIGHT_OPACITY),
});