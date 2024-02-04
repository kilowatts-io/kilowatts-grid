import React from "react";
import { View, StyleSheet } from "react-native";
import { DeltaVolumeView, DeltaVolumeViewEmpty } from "./delta-volume";
import { OutputVolumeView, OutputVolumeViewEmpty } from "./output-text";
import { BalancingVolumeView } from "./balancing-volume";
import { LiveItemName } from "./name";
import { IconView, IconViewEmpty } from "./icon";
import ErrorBoundary from "react-native-error-boundary";

interface GbLiveListItemProps {
  type:
    | "gas"
    | "hydro"
    | "nuclear"
    | "wind"
    | "coal"
    | "battery"
    | "interconnectors"
    | "solar"
    | "biomass";
  name: string;
  capacity: number;
  output: number;
  delta: number;
  balancingVolume: number;
  balancingDirection: "offer" | "bid" | "none";
  capacityFactor: number;
}

export const GbLiveListItem: React.FC<GbLiveListItemProps> = (p) => (
  <View style={styles.itemWrapper}>
    <View style={styles.left}>
      <ErrorBoundary FallbackComponent={null}>
        <IconView
          type={p.type}
          capacityFactor={p.capacityFactor}
          balancingDirection={p.balancingDirection}
        />
      </ErrorBoundary>
      <LiveItemName name={p.name} />
    </View>
    <View style={styles.right}>
      <BalancingVolumeView balancingVolume={p.balancingVolume} />
      <OutputVolumeView capacity={p.capacity} output={p.output} />
      <DeltaVolumeView delta={p.delta} />
    </View>
  </View>
);

export const GbLiveListItemBalancingTotal: React.FC<{
  balancingVolume: number;
  name: string;
}> = (p) => (
  <View style={styles.itemWrapper}>
    <View style={styles.left}>
      <IconViewEmpty />
      <LiveItemName name={p.name} />
    </View>
    <View style={styles.right}>
      <BalancingVolumeView balancingVolume={p.balancingVolume} />
      <OutputVolumeViewEmpty />
      <DeltaVolumeViewEmpty />
    </View>
  </View>
);

export const styles = StyleSheet.create({
  itemWrapper: {
    height: 35,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 10,
    padding: 5,
  },
  left: {
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  right: {
    justifyContent: "flex-end",
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
  },
});
