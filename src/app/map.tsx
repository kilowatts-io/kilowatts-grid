import React from "react";
import { useDataContext } from "../contexts/data";
import { useSharedValue } from "react-native-reanimated";
import { MapScreenHeaderBar } from "../components/header-bar";
import SvgMap from "../components/svg-map/svg-map";
import { GB_MAP_CENTER } from "../atoms/svg-map";
import { SvgMapContext } from "../contexts/svg-map";
import { LargeScreenRedirect } from "../hooks/screen";

const backUrl = "/";

const HomeMapScreen: React.FC = () => {
  const data = useDataContext();
  const title = "Kilowatts Grid";
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
        <MapScreenHeaderBar title={title} backUrl={backUrl} />

        <SvgMap {...data.data.map} />
      </SvgMapContext.Provider>
    </>
  );
};

const WithSmallScreen = () => (
  <LargeScreenRedirect redirectUrl={backUrl}>
    <HomeMapScreen />
  </LargeScreenRedirect>
);

export default WithSmallScreen;
