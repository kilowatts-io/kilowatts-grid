import React from "react";
import {
    ListScreenHeaderBar,
    MapScreenHeaderBar,
} from "../components/header-bar";
import { FuelTypesList } from "../components/icon-list-item";
import SvgMap from "./svg-map";
import { SvgMapContext, useSvgMapContextValue } from "../contexts/svg-map";
import LargeScreen from "../atoms/large-screen-layout";
import { useHome } from "../hooks/data";
import * as nav from "../utils/nav";
import { HomeHelmet } from "../utils/nav";

const title = "Grid";

const SvgMapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SvgMapContext.Provider
    value={useSvgMapContextValue({})}
  >
    {children}
  </SvgMapContext.Provider>
);

export const SmallHomeScreen: React.FC = () => {
  const { fuel_types } = useHome();
  return (
    <>
      <HomeHelmet />

      <ListScreenHeaderBar title={title} mapUrl={nav.home_map} />
      <FuelTypesList data={fuel_types} />
    </>
  );
};

export const LargeHomeScreen: React.FC = () => {
  const { fuel_types, map } = useHome();

  return (
    <SvgMapProvider>
      <HomeHelmet />

      <MapScreenHeaderBar title={title} backUrl={nav.home} />

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
      <>
        <nav.HomeMapHelmet />
        <SvgMapProvider>
          <MapScreenHeaderBar title={title} backUrl={nav.home} />

          <SvgMap {...map} />
        </SvgMapProvider>
      </>
    );
};
