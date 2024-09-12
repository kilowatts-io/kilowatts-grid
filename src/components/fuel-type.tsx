import { GB_MAP_CENTER } from "@/src/atoms/svg-map";
import {
    ListScreenHeaderBar,
    MapScreenHeaderBar,
} from "@/src/components/header-bar";
import SvgMap from "@/src/components/svg-map/svg-map";
import { SvgMapContext } from "@/src/contexts/svg-map";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import * as hooks from "@/src/hooks/data";
import * as nav from "@/src/utils/nav";
import { Redirect } from "expo-router";
import LargeScreen from "../atoms/large-screen-layout";
import { capitalise } from "../utils/misc";
import { UnitGroupsList } from "./icon-list-item";

const useSvgMapContextValue = () => ({
    zoom: useSharedValue(1),
    centerLat: useSharedValue(GB_MAP_CENTER.lat),
    centerLng: useSharedValue(GB_MAP_CENTER.lng),
    translationX: useSharedValue(0),
    translationY: useSharedValue(0),
    cursorHovered: useSharedValue(false),
});

const FuelTypeMap: React.FC<{ title: string; data: any }> = ({ title, data }) => (
    <SvgMapContext.Provider value={useSvgMapContextValue()}>
        <MapScreenHeaderBar title={title} backUrl={nav.home} />
        <SvgMap unit_groups={data.map_icons} foreign_markets={[]} />
    </SvgMapContext.Provider>
);

const FuelTypeList: React.FC<{ title: string; data: any; mapUrl: string }> = ({ title, data, mapUrl }) => (
    <>
        <ListScreenHeaderBar title={title} mapUrl={mapUrl} backUrl={nav.home} />
        <UnitGroupsList data={data.list_data} />
    </>
);

export const FuelTypeMapScreen: React.FC = () => {
    const title = nav.useFuelTypeTitle();
    const data = hooks.useFuelType(nav.useFuelType());
    if (!data) return null;
    return <FuelTypeMap title={title} data={data} />;
};

export const FuelTypeSmallScreen: React.FC = () => {
    const fuel_type = nav.useFuelType();
    const data = hooks.useFuelType(fuel_type);
    const title = capitalise(fuel_type);

    if (data.list_data.length === 0) return <Redirect href={nav.home as any} />;

    return <FuelTypeList title={title} data={data} mapUrl={nav.fuel_type_map(fuel_type)} />;
};

export const FuelTypeLargeScreen: React.FC = () => {
    const fuel_type = nav.useFuelType();
    const data = hooks.useFuelType(fuel_type);
    const title = capitalise(fuel_type);

    if (data.list_data.length === 0) return <Redirect href={nav.home as any} />;

    return (
        <SvgMapContext.Provider value={useSvgMapContextValue()}>
            <MapScreenHeaderBar title={title} backUrl={nav.home} />
            <LargeScreen
                left={<UnitGroupsList data={data.list_data} />}
                right={<SvgMap unit_groups={data.map_icons} foreign_markets={[]} />}
            />
        </SvgMapContext.Provider>
    );
};
