// split screen components that combine the map at the top with a scrollable list of icons at the bottom
import React from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import SvgMap from "./svg-map";
import { FuelTypesList, UnitGroupsList } from "./icon-list-item";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useDataContext } from "../contexts/data";
import UnitGroupCard from "./unit-group-card";
import { useNavigation, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { londonTimeHHMMSS } from "../utils/dateTime";
import { useSharedValue } from "react-native-reanimated";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const HeaderBar: React.FC<{
  title: string;
  backUrl?: string;
}> = (p) => {
  const nav = useNavigation();
  const router = useRouter();
  React.useEffect(() => {
    nav.setOptions({
      headerTitle: capitalise(p.title),
    });
  }, [p.title]);
  React.useEffect(() => {
    if (!p.backUrl) {
      nav.setOptions({ headerLeft: () => null });
    } else {
      nav.setOptions({
        headerLeft: () => (
          <Button
            icon="chevron-left"
            onPress={() => router.replace(p.backUrl as any)}
          >
            <></>
          </Button>
        ),
      });
    }
  }, [p.backUrl, nav, router]);
  return <></>;
};

interface SplitScreenComponentProps {
  top: AppMapData & { initialCenter?: Coords };
  bottom: React.ReactNode;
}

/**
 * On devices without a touch screen, fix the screen 50/50
 */
const NonTouchScreen: React.FC<SplitScreenComponentProps> = ({
  top,
  bottom,
}) => {
  const dims = useWindowDimensions();
  return (
    <View style={styles.wholeScreen}>
      <View style={styles.top}>
        <SvgMap
          {...top}
          size={{ height: dims.height / 2, width: dims.width }}
        />
      </View>
      <View style={styles.bottom}>{bottom}</View>
    </View>
  );
};

const SNAP_POINTS = Array.from({ length: 100 }, (_, i) => `${(i + 1) * 1}%`);

const INITIAL_SNAP_POINT = 50;
const TOP_BOTTOM_MARGIN = 60;

/**
 * On touch screen devices, render a bottom view scrollable component
 */
const TouchScreen: React.FC<SplitScreenComponentProps> = ({ top, bottom }) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapIndex = useSharedValue(INITIAL_SNAP_POINT);
  const usableHeight = useWindowDimensions().height - TOP_BOTTOM_MARGIN;

  return (
    <View style={styles.wholeScreen}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={SNAP_POINTS}
        index={snapIndex.value}
        style={{ zIndex: 1 }}
      >
        <BottomSheetView>{bottom}</BottomSheetView>
      </BottomSheet>

      <SvgMap
        {...top}
        size={{ height: usableHeight, width: useWindowDimensions().width }}
        />
    </View>
  );
};

const useIsTouchScreen = () => {
  const [isTouchScreen, setIsTouchScreen] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      setIsTouchScreen(true);
    } else {
      const handleTouchStart = () => {
        setIsTouchScreen(true);
      };
      document.addEventListener("touchstart", handleTouchStart);
      return () => {
        document.removeEventListener("touchstart", handleTouchStart);
      };
    }
  }, []);
  return isTouchScreen;
};

const SPLIT_SCREEN_WIDTH_BREAKPOINT = 800;

export const useNarrowScreen = () => {
  const { width } = useWindowDimensions();
  return width < SPLIT_SCREEN_WIDTH_BREAKPOINT;
};

/**
 * A component that switches between touch and non-touch screen components based on the device's capabilities
 */
const SplitScreen: React.FC<SplitScreenComponentProps> = ({ top, bottom }) => {
  const isNarrowScreen = useNarrowScreen();
  const isTouchScreen = useIsTouchScreen();
  const dims = useWindowDimensions();
  if (!isNarrowScreen) {
    return (
      <View style={styles.wide}>
                <View style={styles.right}>{bottom}</View>

        <View style={styles.left}>
          <SvgMap {...top} size={{ 
            height: dims.height, 
            width: dims.width / 2
           }} />

        </View>
      </View>
    );
  }
  return isTouchScreen ? (
    <TouchScreen top={top} bottom={bottom} />
  ) : (
    <NonTouchScreen top={top} bottom={bottom} />
  );
};

/**
 * A component that renders all generator and foreign market icons on the map with totals for each fuel type in the bottom panel.
 */
export const HomeScreen: React.FC = () => {
  const { data } = useDataContext();
  return (
    <>
      <HeaderBar title={`Grid at ${londonTimeHHMMSS(new Date(data.dt))}`} />
      <SplitScreen
        top={data.map}
        bottom={<FuelTypesList data={data.lists.fuel_types} />}
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
  const { data } = useDataContext();
  const map_icons = data.map.unit_groups.filter(
    (x) => x.fuel_type.toLowerCase() === p.fuel_type.toLowerCase()
  );
  const list_data = data.lists.unit_groups.filter(
    (x) => x.fuel_type.toLowerCase() === p.fuel_type.toLowerCase()
  );
  if(!map_icons || !list_data) {
    return <></>;
  }
  return (
    <>
      <HeaderBar title={p.fuel_type} backUrl={`/`} />
      <SplitScreen
        top={{
          unit_groups: map_icons,
          foreign_markets: []
        }}
        bottom={<UnitGroupsList data={list_data} />}
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
  const list_data = data.lists.unit_groups.find(
    (x) => x.code.toLowerCase() === p.code.toLowerCase()
  );

  if (!map_icon || !list_data) {
    console.log("No data found for unit group", p.code);
    return <></>;
  }


  return (
    <>
      <HeaderBar
        title={list_data.name}
        backUrl={`fuel_type/${list_data.fuel_type}`}
      />
      <SplitScreen
        top={
          {
            unit_groups: [map_icon],
            foreign_markets: [],
            initialCenter: map_icon.coords
          }
        }
        bottom={<UnitGroupCard {...list_data} />}
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
