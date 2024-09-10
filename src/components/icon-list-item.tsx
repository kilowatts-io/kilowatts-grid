import { FlashList } from "@shopify/flash-list";
import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LIST_ICON_DIMS } from "../constants";
import { getBalancingColor } from "../utils/colors";
import { useDataContext } from "../contexts/data";
import VersionInfo from "./version-info/version-info";
import { EU } from "@/src/atoms/flags";
import * as i from "@/src/components/icons";
import { Button, List, Avatar } from "react-native-paper";
import { Link } from "expo-router";
import { ErrorBoundaryBlank } from "./error-boundary";

export const formatMW = (mw: number) => {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(1)}GW`;
  }
  return `${Math.round(mw)}MW`;
};

const renderDeltaText = (delta: number) => delta === 0 ? '': (delta > 0 ? "↑" : "↓")

const IconListItem: React.FC<
  AppListIconProps & {
    href: string;
    hideIcon?: boolean;
  }
> = (p) => {
  const ft = p.fuel_type;

  const ot = ` ${formatMW(p.output.level)} / ${formatMW(p.capacity)}`
  const dt = renderDeltaText(p.output.delta)

  const description = `${dt}${ot}`

  const color = getBalancingColor(p.balancing_volume)

  return (
    <Link href={p.href as any}>
      <List.Item
      
      style={styles.listItem}
        title={p.name}
        left={() => (
          <ErrorBoundaryBlank>
            {!p.hideIcon && (
             <View style={styles.iconWrapper}>
               <Canvas style={styles.iconCanvas}>
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
            )}
          </ErrorBoundaryBlank>
        )}
        description={description}
        descriptionStyle={{ color }}
        right={() => <List.Icon icon="chevron-right" />}
      />
    </Link>
  );
};

const BalancingTotalItem: React.FC<{
  name: string;
  value: number;
}> = (p) => (
  <List.Item
    title={p.name}
    right={() => (
      <View style={styles.description}>
        <View style={styles.output}>
          <Text style={styles.outputText}>{formatMW(p.value)}</Text>
        </View>
      </View>
    )}
  />
);

export const GbBalancingTotals = () => {
  const { lists } = useDataContext().data;
  const { bids, offers } = lists.balancing_totals;
  return (
    <>
      <View style={styles.totals}>
        <>
          <BalancingTotalItem name="Total Bid Acceptances" value={bids} />
          <BalancingTotalItem name="Total Offer Acceptances" value={offers} />
        </>
      </View>
      <VersionInfo />
    </>
  );
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const UnitGroupsList: React.FC<{
  data: AppListIconProps[];
}> = ({ data }) => {
  return (
    <FlashList
      estimatedItemSize={40}
      data={data}
      renderItem={({ item }) => (
        <IconListItem
          {...item}
          hideIcon={true}
          href={`/unit_group/${item.code.toLowerCase()}`}
        />
      )}
    />
  );
};

export const FuelTypesList: React.FC<{
  data: AppListIconProps[];
}> = ({ data }) => {
  return (
    <FlashList
      estimatedItemSize={40}
      data={data}
      renderItem={({ item }) => (
        <IconListItem
          {...item}
          name={capitalise(item.fuel_type)}
          href={`/fuel_type/${item.fuel_type.toLowerCase()}`}
        />
      )}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCanvas: {
    ...LIST_ICON_DIMS,
  },
  listItem: {
    width: '100%',
    // height: 50,
    // paddingHorizontal: 5,
    // backgroundColor: 'white',
    // display: 'flex',
    // alignItems: 'center',
  },
  description: {
    // flexDirection: "row",
    // gap: 3,
    // justifyContent: "flex-end",
    // alignItems: 'center',
    // flex: 1,
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
  delta: {
    display: "flex",
    width: 10,
  },
  deltaText: {
    textAlign: "center",
  },
  totals: {
    paddingTop: 15,
  },
});

export default IconListItem;
