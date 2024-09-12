// create a hello world page
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { MapScreenHeaderBar } from "@/src/components/header-bar";
import { useDataContext } from "@/src/contexts/data";
import { capitalise } from "@/src/utils/misc";
import SvgMap from "@/src/components/svg-map/svg-map";
import { LargeScreenRedirect } from "@/src/hooks/screen";
import { SvgMapContext } from "@/src/contexts/svg-map";
import { useSharedValue } from "react-native-reanimated";

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

const useBackUrl = () => {
  const code = useLocalSearchParams().code as string;
  return `/unit_group/${code}`;
};

const UnitGroupMapScreen: React.FC = () => {
  const code = useLocalSearchParams().code as string;
  const data = useData(code);
  if (!data) return;
  const { map_icon } = data;

  return (
    <>
      <MapScreenHeaderBar
        title={capitalise(data.list_data.name)}
        backUrl={useBackUrl()}
      />
      <SvgMapContext.Provider
        value={{
          zoom: useSharedValue(1),
          centerLat: useSharedValue(map_icon.coords.lat),
          centerLng: useSharedValue(map_icon.coords.lng),
          translationX: useSharedValue(0),
          translationY: useSharedValue(0),
          cursorHovered: useSharedValue(false),
        }}
      >
        <SvgMap unit_groups={[map_icon]} foreign_markets={[]} />
      </SvgMapContext.Provider>
    </>
  );
};

const WithSmallScreen = () => {
  const backUrl = useBackUrl();
  return (
    <LargeScreenRedirect redirectUrl={backUrl}>
      <UnitGroupMapScreen />;
    </LargeScreenRedirect>
  );
};

export default WithSmallScreen;
