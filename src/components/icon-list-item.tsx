import { FlashList } from "@shopify/flash-list";
import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LIST_ICON_DIMS } from "../constants";
// need to consolidate these
import { getBalancingColor } from "../utils/colors";
import { londonTimeHHMMSS } from "../utils/dateTime";
import { useDataContext } from "../contexts/data";
import VersionInfo from "./version-info/version-info";
import { EU } from "@/src/atoms/flags";
import { selectUnitGroupCode } from "@/src/state/live";
import { useAppSelector } from "@/src/state";
import * as i from "@/src/components/icons";

export const formatMW = (mw: number) => {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(1)} GW`;
  }

  return `${Math.round(mw)} MW`;
};

const balancingSymbol = (balancingVolume: number) =>
  balancingVolume > 0 ? "↑" : "↓";

const renderBalancingText = (balancingVolume: number) =>
  balancingVolume > 0 ? "↑" : "↓";

const IconListItem: React.FC<AppListIconProps> = (p) => {
  const ft = p.fuel_type;
  // const { symbol, color } = deltaSymbolColor(p.output.delta);
  return (
    <View
      style={{
        ...styles.itemWrapper,
        ...(p.selected ? styles.selectedItemWrapper : {}),
      }}
    >
      <View style={styles.left}>
        <View style={styles.icon}>
          <Canvas style={styles.icon}>
            {ft === "wind" && <i.WindListIcon {...p} />}
            {ft === "battery" && <i.BatteryListIcon {...p} />}
            {ft === "solar" && <i.SolarListIcon {...p} />}
            {ft === "interconnector" && <EU />}
            {(ft === "gas" ||
              ft === "oil" ||
              ft === "biomass" ||
              ft === "coal" ||
              ft === "nuclear" ||
              ft === "hydro") && <i.DispatchableListIcon {...p} />}
          </Canvas>
        </View>
        <View style={styles.name}>
          <Text>{p.name}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View
          style={{
            ...styles.balancing,
            backgroundColor: getBalancingColor(p.balancing_volume),
          }}
        >
          <Text style={styles.balancingText}>
            {renderBalancingText(p.balancing_volume)}
          </Text>
        </View>
        <View style={styles.output}>
          <Text style={styles.outputText}>
            {`${formatMW(p.output.level)} / ${formatMW(p.capacity)}`}
          </Text>
        </View>
        <View style={styles.delta}>
          <Text
            style={{
              ...styles.deltaText,
              color: getBalancingColor(p.balancing_volume),
            }}
          >
            {balancingSymbol(p.balancing_volume)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const UnitGroupsList: React.FC = () => {
  const list = React.useRef<FlashList<AppListIconProps>>(null);
  const selectedCode = useAppSelector(selectUnitGroupCode);

  React.useEffect(() => {
    if (!selectedCode) return;
    const index = data.findIndex(({ code }) => code === selectedCode);
    if (!index || index < 0) return undefined;
    list.current?.scrollToIndex({ index, animated: false });
  }, [selectedCode]);

  const data = useDataContext().data.lists.unit_groups;
  return (
    <FlashList
      ref={list}
      data={data}
      renderItem={({ item }) => (
        <IconListItem {...item} selected={selectedCode === item.code} />
      )}
    />
  );
};

const BalancingTotalItem: React.FC<{
  name: string;
  value: number;
}> = (p) => (
  <View style={styles.itemWrapper}>
    <View style={styles.left}>
      <View style={styles.icon} />
      <View style={styles.name}>
        <Text>{p.name}</Text>
      </View>
    </View>
    <View style={styles.right}>
      <View style={styles.output}>
        <Text style={styles.outputText}>{formatMW(p.value)}</Text>
      </View>
    </View>
  </View>
);

export const GbBalancingTotals = () => {
  const { dt, lists } = useDataContext().data;
  const { bids, offers } = lists.balancing_totals;
  return (
    <>
      <View style={styles.totals}>
        <>
          <BalancingTotalItem name="Total Bid Acceptances" value={bids} />
          <BalancingTotalItem name="Total Offer Acceptances" value={offers} />
        </>
      </View>
      <View style={styles.center}>
        <Text>{`Valid for ${londonTimeHHMMSS(new Date(dt))}`}</Text>
      </View>
      <VersionInfo />
    </>
  );
};

export const FuelTypesList: React.FC = () => (
  <FlashList
    data={useDataContext().data.lists.fuel_types}
    renderItem={({ item }) => <IconListItem {...item} />}
    ListFooterComponent={GbBalancingTotals}
  />
);

const styles = StyleSheet.create({
  itemWrapper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 40,
    justifyContent: "flex-start",
    padding: 5,
  },
  icon: {
    ...LIST_ICON_DIMS,
  },
  name: {},
  output: {
    alignItems: "flex-end",
    display: "flex",
    justifyContent: "center",
    width: 110,
  },
  outputText: {
    fontSize: 11,
    textAlign: "right",
  },
  left: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
    justifyContent: "flex-start",
  },
  right: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    justifyContent: "flex-end",
  },
  // eslint-disable-next-line react-native/no-color-literals
  selectedItemWrapper: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
  delta: {
    display: "flex",
    width: 10,
  },
  deltaText: {
    textAlign: "center",
  },
  balancing: {
    alignItems: "flex-end",
    borderRadius: 2,
    display: "flex",
    height: "80%",
    justifyContent: "center",
    maxWidth: 80,
    padding: 3,
  },
  balancingText: {
    color: "white",
    fontSize: 9,
    textAlign: "right",
  },
  totals: {
    paddingTop: 15,
  },
  center: {
    paddingTop: 50,
  },
});

export default IconListItem;
