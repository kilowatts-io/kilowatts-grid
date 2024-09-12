// create a hello world page
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SvgMapContext } from "@/src/contexts/svg-map";
import { HeaderBar, ListScreenHeaderBar, MapScreenHeaderBar } from "@/src/components/header-bar";
import { useDataContext } from "@/src/contexts/data";
import { capitalise } from "@/src/utils/misc";
import { useSharedValue } from "react-native-reanimated";
import UnitGroupCard from "@/src/components/unit-group-card";
import SvgMap from "@/src/components/svg-map/svg-map";
import { useScreen } from "@/src/hooks/screen";
import LargeScreen from "@/src/atoms/large-screen-layout";

const useData = (code: string) => {
  const { data } = useDataContext();
  const map_icon = data.map.unit_groups.find(
    (x) => x.code.toLowerCase() === code.toLowerCase()
  );
  const list_data = data.lists.unit_groups.find(
    (x) => x.code.toLowerCase() === code.toLowerCase()
  );
  if (!map_icon || !list_data) return null;
  return { map_icon, list_data };
};

const UnitGroupLargeScreen: React.FC = () => {
  const code = useLocalSearchParams().code as string;
  const data = useData(code);
  if (!data) return;
  const { map_icon, list_data } = data;
  return (
    <>
      <MapScreenHeaderBar
        title={capitalise(data.list_data.name)}
        backUrl={`/fuel_type/${map_icon.fuel_type.toLowerCase()}`}
      />
      <SvgMapContext.Provider
        value={{
          zoom: useSharedValue(3),
          centerLat: useSharedValue(map_icon.coords.lat),
          centerLng: useSharedValue(map_icon.coords.lng),
          translationX: useSharedValue(0),
          translationY: useSharedValue(0),
          cursorHovered: useSharedValue(false),
        }}
      >
        <LargeScreen
          left={<UnitGroupCard {...list_data} />}
          right={<SvgMap unit_groups={[map_icon]} foreign_markets={[]} />}
        />
      </SvgMapContext.Provider>
      <UnitGroupCard {...list_data} />
    </>
  );
};

const UnitGroupSmallScreen: React.FC = () => {
  const code = useLocalSearchParams().code as string;
  const data = useData(code);
  if (!data) return;
  const { list_data } = data;

  return (
    <>
      <ListScreenHeaderBar
        title={capitalise(data.list_data.name)}
        backUrl={`/fuel_type/${list_data.fuel_type.toLowerCase()}`}
        mapUrl={`/unit_group/${list_data.code}/map`}
      />
      <UnitGroupCard {...list_data} />
    </>
  );
};

const UnitGroupScreen = () => {
  const smallScreen = useScreen().smallScreen.value;
  return smallScreen ? <UnitGroupSmallScreen /> : <UnitGroupLargeScreen />;
};

export default UnitGroupScreen;
