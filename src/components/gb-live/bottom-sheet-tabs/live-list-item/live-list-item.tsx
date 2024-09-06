import React from "react";
import { StyleSheet, View } from "react-native";

import { ErrorBoundaryBlank } from "../../error-boundary";

import { BalancingVolumeView } from "./balancing-volume";
import { DeltaVolumeView, DeltaVolumeViewEmpty } from "./delta-volume";
import { IconView, IconViewEmpty } from "./icon";
import { LiveItemName } from "./name";
import { OutputVolumeView, OutputVolumeViewEmpty } from "./output-text";

interface GbLiveListItemProps {
  type:
    | "gas"
    | "hydro"
    | "nuclear"
    | "wind"
    | "coal"
    | "oil"
    | "battery"
    | "interconnector"
    | "solar"
    | "biomass";
  name: string;
  capacity: number;
  output: number;
  delta: number;
  balancingVolume: number;
  balancingDirection: "offer" | "bid" | "none";
  capacityFactor: number;
  selected: boolean;
  cycleSeconds: number | null;
}

export const GbLiveListItem: React.FC<GbLiveListItemProps> = (p) => (
  <View
    style={{
      ...styles.itemWrapper,
      ...(p.selected ? styles.selectedItemWrapper : {}),
    }}
  >
    <View style={styles.left}>
      <ErrorBoundaryBlank>
        <IconView
          type={p.type}
          capacityFactor={p.capacityFactor}
          balancingDirection={p.balancingDirection}
          cycleSeconds={p.cycleSeconds}
        />
      </ErrorBoundaryBlank>
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
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 40,
    justifyContent: "flex-start",
    padding: 5,
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
});
