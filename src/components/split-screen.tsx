// split screen components that combine the map at the top with a scrollable list of icons at the bottom
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import SvgMap from "./svg-map";
import { Icon } from "react-native-paper";
import { FuelTypesList, UnitGroupsList } from "./icon-list-item";
import { useDataContext } from "../contexts/data";
import UnitGroupCard from "./unit-group-card";
import { londonTimeHHMMSS } from "../utils/dateTime";
import { Stack, useNavigation, useRouter } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const useBackUrl = (backUrl?: string) => {
  const router = useRouter();
  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if(backUrl) {
        router.push(backUrl);
      }
    });
    return unsubscribe;
  }, [navigation, router, backUrl]);
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Title: React.FC<{ title: string }> = ({ title }) => (
  <Stack.Screen options={{ title: capitalise(title) }} />
);

interface SplitScreenComponentProps {
  svgMap: AppMapData & {
    initialCenter?: Coords;
    zoom?: number;
    onTapIcon?: (index: number) => void;
  };
  list: React.ReactNode;
}

const SPLIT_SCREEN_WIDTH_BREAKPOINT = 800;

export const useNarrowScreen = () => {
  const { width } = useWindowDimensions();
  return width < SPLIT_SCREEN_WIDTH_BREAKPOINT;
};

/**every integer from 0 - 100 */
const START_SNAP = 15;
const END_SNAP = 85;
const SNAP_POINTS = Array.from(
  { length: END_SNAP - START_SNAP },
  (_, i) => i + START_SNAP
).map((x) => `${x}%`);
const INITIAL_SNAP_POINT = Math.trunc(SNAP_POINTS.length / 6);

const Tab = createBottomTabNavigator();

/**
 * A component that switches between touch and non-touch screen components based on the device's capabilities
 */
const SplitScreen: React.FC<SplitScreenComponentProps> = (p) => {
  const isSmallScreen = useNarrowScreen();
  const dims = useWindowDimensions();
  const svgMap = <SvgMap {...p.svgMap} size={dims} />;

  if (!isSmallScreen) {
    return (
      <View style={styles.wide}>
        <View style={styles.right}>{p.list}</View>
        <View style={styles.left}>{svgMap}</View>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="List"
        getComponent={() => () => p.list}
        // add icon
        options={{
          tabBarIcon: (p) => <Icon source="clipboard-list" {...p} />,
        }}
      />
      <Tab.Screen
        name="Map"
        getComponent={() => () => svgMap}
        // add icon
        options={{
          tabBarIcon: (p) => <Icon source="map" {...p} />,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * A component that renders all generator and foreign market icons on the map with totals for each fuel type in the bottom panel.
 */
export const HomeScreen: React.FC = () => {
  useBackUrl();
  const { data } = useDataContext();
  const router = useRouter();
  return (
    <>
      <Title title={`Grid at ${londonTimeHHMMSS(new Date(data.dt))}`} />
      <SplitScreen
        svgMap={{
          ...data.map,
          onTapIcon: (index) =>
            router.push(
              `/unit_group/${data.map.unit_groups[index].code.toLowerCase()}`
            ),
        }}
        list={<FuelTypesList data={data.lists.fuel_types} />}
      />
    </>
  );
};

/**
 * A component that renders a specific fuel type's icons on the map and individual icons in the bottom panel.
 */
export const FuelTypeScreen: React.FC<{
  fuel_type: FuelType;
}> = (p) => {
  useBackUrl("/");

  const router = useRouter();
  const { data } = useDataContext();
  const map_icons = data.map.unit_groups.filter(
    (x) => x.fuel_type.toLowerCase() === p.fuel_type.toLowerCase()
  );
  const list_data = data.lists.unit_groups.filter(
    (x) => x.fuel_type.toLowerCase() === p.fuel_type.toLowerCase()
  );

  if (!map_icons || !list_data) {
    return <></>;
  }
  return (
    <>
      <Title title={p.fuel_type} />
      <SplitScreen
        svgMap={{
          unit_groups: map_icons,
          foreign_markets: [],
          onTapIcon: (index) =>
            router.push(`/unit_group/${list_data[index].code.toLowerCase()}`),
        }}
        list={<UnitGroupsList data={list_data} />}
      />
    </>
  );
};

/**
 * A component that renders a specific unit group's icons only on the map (around which it should be centered)
 * In the bottom, it should present a card with the current snapshot of the unit group
 */
export const UnitGroupScreen: React.FC<{
  code: string;
}> = (p) => {
  const { data } = useDataContext();
  const map_icon = data.map.unit_groups.find(
    (x) => x.code.toLowerCase() === p.code.toLowerCase()
  );

  useBackUrl(map_icon && `/fuel_type/${map_icon.fuel_type.toLowerCase()}`);

  const list_data = data.lists.unit_groups.find(
    (x) => x.code.toLowerCase() === p.code.toLowerCase()
  );

  if (!map_icon || !list_data) {
    console.log("No data found for unit group", p.code);
    return <></>;
  }

  return (
    <>
      <Title title={list_data.name} />
      <SplitScreen
        svgMap={{
          unit_groups: [map_icon],
          foreign_markets: [],
          initialCenter: map_icon.coords,
          zoom: 1.5,
        }}
        list={<UnitGroupCard {...list_data} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wholeScreen: { flex: 1 },
  top: { height: "50%", zIndex: 0 },
  bottom: { height: "50%", zIndex: 1 },
  wide: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
  },
  left: {
    width: "50%",
  },
  right: {
    width: "50%",
  },
});
