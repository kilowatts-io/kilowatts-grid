import React, { useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export const ZOOM_INC = 0.1;
export const DEFAULT_ZOOM = 1.5;
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
    centerLat: { value: 0 } as SharedValue<number>,
    centerLng: { value: 0 } as SharedValue<number>,
    translationX: { value: 0 } as SharedValue<number>,
    translationY: { value: 0 } as SharedValue<number>,
    cursorHovered: { value: false } as SharedValue<boolean>,
    highlightOpacity: { value: 0 } as SharedValue<number>,
};

export const SvgMapContext = React.createContext<SvgMapContextProps>(defaultValues);


export const useSvgMapContext = () => useContext(SvgMapContext);