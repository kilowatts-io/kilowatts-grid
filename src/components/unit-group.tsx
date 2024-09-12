import React from "react";
import { DEFAULT_HIGHIGHT_OPACITY, SvgMapContext } from "@/src/contexts/svg-map";
import {
  ListScreenHeaderBar,
  MapScreenHeaderBar,
} from "@/src/components/header-bar";
import { capitalise } from "@/src/utils/misc";
import { useSharedValue } from "react-native-reanimated";
import UnitGroupCard from "@/src/components/unit-group-card";
import SvgMap from "@/src/components/svg-map/svg-map";
import LargeScreen from "@/src/atoms/large-screen-layout";
import { useUnitGroup } from "@/src/hooks/data";
import * as nav from "@/src/utils/nav";


const title = (x: { name: string }) => capitalise(x.name);
const backUrl = (x: { fuel_type: FuelType }) => `/fuel_type/${x.fuel_type}`;

const useUnitGroupData = () => {
  const code = nav.useUnitCode();
  return useUnitGroup(code);
};

const SvgMapProvider: React.FC<{
  map_icon: MapGeneratorIconProps
  children: React.ReactNode;
}> = ({ map_icon, children }) => (
  <SvgMapContext.Provider
    value={{
      zoom: useSharedValue(3),
      centerLat: useSharedValue(map_icon.coords.lat),
      centerLng: useSharedValue(map_icon.coords.lng),
      translationX: useSharedValue(0),
      translationY: useSharedValue(0),
      cursorHovered: useSharedValue(false),
      highlightOpacity: useSharedValue(DEFAULT_HIGHIGHT_OPACITY),

    }}
  >
    {children}
  </SvgMapContext.Provider>
);

export const UnitGroupLargeScreen: React.FC = () => {
  const data = useUnitGroupData();
  if (!data) return null;
  const { map_icon, list_data } = data;

  return (
    <>
      <MapScreenHeaderBar
        title={title(list_data)}
        backUrl={backUrl(map_icon)}
      />
      <SvgMapProvider map_icon={map_icon}>
        <LargeScreen
          left={<UnitGroupCard {...list_data} />}
          right={<SvgMap unit_groups={[map_icon]} foreign_markets={[]} />}
        />
      </SvgMapProvider>
      <UnitGroupCard {...list_data} />
    </>
  );
};

export const UnitGroupSmallScreen: React.FC = () => {
  const data = useUnitGroupData();
  if (!data) return null;
  const { list_data } = data;

  return (
    <>
      <ListScreenHeaderBar
        title={title(list_data)}
        backUrl={backUrl(data.map_icon)}
        mapUrl={nav.unit_group_map(nav.useUnitCode())}
      />
      <UnitGroupCard {...list_data} />
    </>
  );
};

export const useBackUrl = () => nav.unit_group(nav.useUnitCode());

export const UnitGroupMapScreen: React.FC = () => {
  const data = useUnitGroupData();
  if (!data) return null;
  const { map_icon, list_data } = data;

  return (
    <>
      <MapScreenHeaderBar
        title={capitalise(list_data.name)}
        backUrl={useBackUrl()}
      />
      <SvgMapProvider map_icon={map_icon}>
        <SvgMap unit_groups={[map_icon]} foreign_markets={[]} />
      </SvgMapProvider>
    </>
  );
};
