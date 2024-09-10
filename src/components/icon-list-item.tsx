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
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { ErrorBoundaryBlank } from "./error-boundary";

export const formatMW = (mw: number) => {
  if (mw >= 1000) {
    return `${(mw / 1000).toFixed(1)} GW`;
  }

  return `${Math.round(mw)} MW`;
};

const balancingSymbol = (balancingVolume: number) =>
  balancingVolume < 0 ? "↓" : "↑";

const renderDeltaText = (delta: number) => (delta > 0 ? "↑" : "↓");

const IconListItem: React.FC<
  AppListIconProps & {
    href: string;
    hideIcon?: boolean;
  }
> = (p) => {
  const ft = p.fuel_type;

  return (
    <Link href={p.href as any}>
      <View
        style={{
          ...styles.itemWrapper,
          ...(p.selected ? styles.selectedItemWrapper : {}),
        }}
      >
        <View style={styles.left}>
          <ErrorBoundaryBlank>
            {!p.hideIcon && (

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
            )}
          </ErrorBoundaryBlank>

          <View style={styles.name}>
            <Text>{p.name}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <View
            style={{
              ...styles.balancing,
              ...(p.balancing_volume
                ? { backgroundColor: getBalancingColor(p.balancing_volume) }
                : {}),
            }}
          >
            {p.balancing_volume !== 0 && (
              <Text style={styles.balancingText}>
                {balancingSymbol(p.balancing_volume)}
              </Text>
            )}
          </View>
          <View style={styles.output}>
            <Text style={styles.outputText}>
              {`${formatMW(p.output.level)} / ${formatMW(p.capacity)}`}
            </Text>
          </View>
          <View style={styles.delta}>
            {p.output.delta !== 0 && (
              <Text style={styles.deltaText}>
                {renderDeltaText(p.output.delta)}
              </Text>
            )}
          </View>
          <View style={styles.chevron}>
            <Button icon="chevron-right">
              <></>
            </Button>
          </View>
        </View>
      </View>
    </Link>
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
  list: {
    display: "flex",
  },
  itemWrapper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
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
  chevron: {
    width: 15,
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
