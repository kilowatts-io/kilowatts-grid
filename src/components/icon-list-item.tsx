import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Canvas } from "@shopify/react-native-skia";
import { List, Card } from "react-native-paper";
import { Link } from "expo-router";
import { useDataContext } from "../contexts/data";
import { useAppDispatch, useAppSelector } from "../state";
import { LIST_ICON_DIMS } from "../constants";
import { getBalancingColor } from "../utils/colors";
import VersionInfo from "./version-info/version-info";
import { EU } from "@/src/atoms/flags";
import * as Icons from "@/src/components/icons";
import { ErrorBoundaryBlank } from "./error-boundary";
import EmbeddedResiduaCard from "./embedded-total-card";
import UnitGroupSearch from "./unit-group-search";
import { renderDeltaText, formatMW, capitalise } from "../utils/misc";
import { DEFAULT_ZOOM, useSvgMapContext } from "../contexts/svg-map";
import { GB_MAP_CENTER } from "../atoms/svg-map";
import { withTiming } from "react-native-reanimated";
import search from "../state/search";

const setFuelType = search.actions.setFuelType;

const IconListItem: React.FC<
  AppListIconProps & { href: string; hideIcon?: boolean }
> = (p) => {
  const {
    fuel_type,
    output,
    capacity,
    balancing_volume,
    name,
    href,
    hideIcon,
  } = p;
  const description = `${renderDeltaText(output.delta)} ${formatMW(
    output.level
  )} / ${formatMW(capacity)}`;
  const color = getBalancingColor(balancing_volume);

  const renderIcon = () => {
    switch (fuel_type) {
      case "wind":
        return <Icons.WindListIcon {...p} />;
      case "battery":
        return <Icons.BatteryListIcon {...p} />;
      case "solar":
        return <Icons.SolarListIcon {...p} />;
      case "interconnector":
        return <EU />;
      case "gas":
      case "oil":
      case "biomass":
      case "coal":
      case "nuclear":
      case "hydro":
        return <Icons.DispatchableListIcon {...p} />;
      default:
        return null;
    }
  };

  return (
    <Link href={href as any}>
      <List.Item
        style={styles.listItem}
        title={capitalise(name)}
        left={() =>
          !hideIcon && (
            <ErrorBoundaryBlank>
              <View style={styles.canvasWrapper}>
                <Canvas style={styles.iconCanvas}>{renderIcon()}</Canvas>
              </View>
            </ErrorBoundaryBlank>
          )
        }
        description={description}
        descriptionStyle={{ color }}
        right={() => <List.Icon icon="chevron-right" />}
      />
    </Link>
  );
};

const BalancingTotalItem: React.FC<{ name: string; value: number }> = ({
  name,
  value,
}) => (
  <List.Item
    title={name}
    description={formatMW(value)}
    style={Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}}
  />
);

const GbBalancingTotals = () => {
  const { lists } = useDataContext().data;
  const { bids, offers } = lists.balancing_totals;
  return (
    <View style={styles.totals}>
      <BalancingTotalItem name="Bid Acceptances" value={bids} />
      <BalancingTotalItem name="Offer Acceptances" value={offers} />
      <VersionInfo />
    </View>
  );
};

const EmptyCard: React.FC = () => (
  <Card.Title title="No matching online generation found." />
);

const UnitGroupsList: React.FC<{ data: AppListIconProps[] }> = ({ data }) => {
  const ctx = useSvgMapContext();
  const search = useAppSelector((state) => state.search.unitGroup);
  const filteredData = React.useMemo(
    () =>
      data.filter((x) =>
        x.name.toLowerCase().includes(search?.toLowerCase() || "")
      ),
    [data, search]
  );

  return (
    <FlashList
      estimatedItemSize={40}
      onPointerLeave={() => {
        ctx.zoom.value = withTiming(DEFAULT_ZOOM);
        ctx.centerLat.value = withTiming(GB_MAP_CENTER.lat);
        ctx.centerLng.value = withTiming(GB_MAP_CENTER.lng);
      }}
      data={filteredData}
      ListHeaderComponent={UnitGroupSearch}
      ListEmptyComponent={EmptyCard}
      ListFooterComponent={EmbeddedResiduaCard}
      renderItem={({ item }) => (
        <View
          onPointerEnter={() => {
            ctx.zoom.value = withTiming(3);
            ctx.centerLat.value = withTiming(item.coords.lat);
            ctx.centerLng.value = withTiming(item.coords.lng);
          }}
        >
          <IconListItem
            {...item}
            hideIcon={true}
            href={`/unit_group/${item.code.toLowerCase()}`}
          />
        </View>
      )}
    />
  );
};

const FuelTypesList: React.FC<{ data: AppListIconProps[] }> = ({ data }) => {
  const dispatch = useAppDispatch();
  return (
    <FlashList
      estimatedItemSize={40}
      data={data}
      renderItem={({ item }) => (
        <View
          onPointerEnter={() => {
            dispatch(setFuelType(item.fuel_type));
          }}
          onPointerLeave={() => {
            dispatch(setFuelType());
          }}
        >
          <IconListItem
            {...item}
            name={capitalise(item.fuel_type)}
            href={`/fuel_type/${item.fuel_type.toLowerCase()}`}
          />
        </View>
      )}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    height: 30,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCanvas: {
    ...LIST_ICON_DIMS,
  },
  listItem: {
    width: "100%",
  },
  totals: {
    paddingTop: 15,
  },
});

export { IconListItem, UnitGroupsList, FuelTypesList };
export default IconListItem;
