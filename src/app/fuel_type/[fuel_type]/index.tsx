import LargeScreen from "@/src/atoms/large-screen-layout";
import { GB_MAP_CENTER } from "@/src/atoms/svg-map";
import {
  ListScreenHeaderBar,
  MapScreenHeaderBar,
} from "@/src/components/header-bar";
import { UnitGroupsList } from "@/src/components/icon-list-item";
import SvgMap from "@/src/components/svg-map/svg-map";
import { useDataContext } from "@/src/contexts/data";
import { SvgMapContext } from "@/src/contexts/svg-map";
import { useScreen } from "@/src/hooks/screen";
import { capitalise } from "@/src/utils/misc";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useSharedValue } from "react-native-reanimated";

const filter = (x: { fuel_type: FuelType }, f: FuelType) =>
  x.fuel_type.toLowerCase() === f.toLowerCase();

const useData = (fuel_type: FuelType) => {
  const { data } = useDataContext();
  return {
    map_icons: data.map.unit_groups.filter((x) => filter(x, fuel_type)),
    list_data: data.lists.unit_groups.filter((x) => filter(x, fuel_type)),
  };
};

const backUrl = "/";

const FuelTypeSmallScreen: React.FC = () => {
  const fuel_type = useLocalSearchParams().fuel_type as FuelType;
  const data = useData(fuel_type);
  const title = capitalise(fuel_type);
  return (
    <>
      <ListScreenHeaderBar
        title={title}
        mapUrl={`fuel_type/${fuel_type}/map`}
        backUrl={backUrl}
      />
      <UnitGroupsList data={data.list_data} />
    </>
  );
};

const FuelTypeLargeScreen: React.FC = () => {
  const fuel_type = useLocalSearchParams().fuel_type as FuelType;
  const data = useData(fuel_type);
  const title = capitalise(fuel_type);
  return (
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
      <MapScreenHeaderBar title={title} backUrl={backUrl} />

      <LargeScreen
        left={<UnitGroupsList data={data.list_data} />}
        right={<SvgMap unit_groups={data.map_icons} foreign_markets={[]} />}
      />
    </SvgMapContext.Provider>
  );
};

const FuelTypeScreen: React.FC = () => {
  const smallScreen = useScreen().smallScreen.value;
  return smallScreen ? <FuelTypeSmallScreen /> : <FuelTypeLargeScreen />;
};

export default FuelTypeScreen;
