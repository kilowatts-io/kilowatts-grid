import React from "react";
import { useSharedValue } from "react-native-reanimated";
import {
    ListScreenHeaderBar,
    MapScreenHeaderBar,
} from "../components/header-bar";
import { FuelTypesList } from "../components/icon-list-item";
import SvgMap from "../components/svg-map/svg-map";
import { GB_MAP_CENTER } from "../atoms/svg-map";
import { SvgMapContext } from "../contexts/svg-map";
import LargeScreen from "../atoms/large-screen-layout";
import { useHome } from "../hooks/data";
import * as nav from "../utils/nav";

const title = "Kilowatts Grid";

const SvgMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SvgMapContext.Provider
        value={{
            zoom: useSharedValue(1),
            centerLat: useSharedValue(GB_MAP_CENTER.lat),
            centerLng: useSharedValue(GB_MAP_CENTER.lng),
            translationX: useSharedValue(0),
            translationY: useSharedValue(0),
            cursorHovered: useSharedValue(false),
        }}
    >
        {children}
    </SvgMapContext.Provider>
);

export const SmallHomeScreen: React.FC = () => {
    const { fuel_types } = useHome();
    return (
        <>
            <ListScreenHeaderBar title={title} mapUrl={nav.home_map} />
            <FuelTypesList data={fuel_types} />
        </>
    );
};

export const LargeHomeScreen: React.FC = () => {
    const { fuel_types, map } = useHome();

    return (
        <SvgMapProvider>
            <MapScreenHeaderBar title={title} />
            <LargeScreen
                left={<FuelTypesList data={fuel_types} />}
                right={<SvgMap {...map} />}
            />
        </SvgMapProvider>
    );
};

export const HomeMapScreen: React.FC = () => {
    const { map } = useHome();
    return (
        <SvgMapProvider>
            <MapScreenHeaderBar title={title} backUrl={nav.home} />
            <SvgMap {...map} />
        </SvgMapProvider>
    );
};
