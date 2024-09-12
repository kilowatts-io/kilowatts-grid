import React from "react";
import { useDataContext } from "../contexts/data";
import { useSharedValue } from "react-native-reanimated";
import {
  ListScreenHeaderBar,
  MapScreenHeaderBar,
} from "../components/header-bar";
import { FuelTypesList } from "../components/icon-list-item";
import SvgMap from "../components/svg-map/svg-map";
import { GB_MAP_CENTER } from "../atoms/svg-map";
import { useScreen } from "../hooks/screen";
import { SvgMapContext } from "../contexts/svg-map";
import LargeScreen from "../atoms/large-screen-layout";

const useData = () => {
  const data = useDataContext();
  return {
    map: data.data.map,
    fuel_types: data.data.lists.fuel_types,
  };
};

const title = "Kilowatts Grid";

const SmallHomeScreen: React.FC = () => {
  const { fuel_types } = useData();

  return (
    <>
      <ListScreenHeaderBar title={title} mapUrl="/map" />
      <FuelTypesList data={fuel_types} />
    </>
  );
};
const LargeHomeScreen: React.FC = () => {
  const { fuel_types, map } = useData();

  return (
    <>
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
        <MapScreenHeaderBar title={title} />
        <LargeScreen
          left={<FuelTypesList data={fuel_types} />}
          right={<SvgMap {...map} />}
        />
      </SvgMapContext.Provider>
    </>
  );
};

const HomeScreen: React.FC = () => {
  const smallScreen = useScreen().smallScreen.value
  return smallScreen ? <SmallHomeScreen /> : <LargeHomeScreen />;
};

export default HomeScreen;
