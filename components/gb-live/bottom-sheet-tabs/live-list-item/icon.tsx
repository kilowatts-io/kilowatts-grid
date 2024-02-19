import React from "react";
import { StyleSheet, View } from "react-native";
import { Canvas } from "@shopify/react-native-skia";

import { ErrorBoundaryBlank } from "../../error-boundary";
import { BatteryListIcon } from "../../icons/battery/list-icon";
import { EU as EUFlag } from "../../icons/cables/flags";
import { DispatchableListIcon } from "../../icons/dispatchable/list-icon";
import { LIST_ICON_DIMS } from "../../icons/list-icons";
import SolarListIcon from "../../icons/solar/list-icon";
import { WindListIcon } from "../../icons/wind/list-icon";

interface IconViewProps {
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
  capacityFactor: number;
  balancingDirection: "offer" | "bid" | "none";
  cycleSeconds: number | null;
}

export const IconView: React.FC<IconViewProps> = (p) => {
  return (
    <View style={styles.icon}>
      <ErrorBoundaryBlank>
        <Canvas style={styles.icon}>
          {p.type === "wind" && <WindListIcon {...p} />}
          {p.type === "battery" && <BatteryListIcon {...p} />}
          {p.type === "solar" && p.cycleSeconds != 0 && (
            <SolarListIcon {...p} />
          )}
          {p.type === "interconnector" && <EUFlag />}
          {(p.type === "gas" ||
            p.type === "oil" ||
            p.type === "biomass" ||
            p.type === "coal" ||
            p.type === "nuclear" ||
            p.type === "hydro") && (
            <DispatchableListIcon
              {...p}
              type={p.type}
            />
          )}
        </Canvas>
      </ErrorBoundaryBlank>
    </View>
  );
};

export const IconViewEmpty = () => <View style={styles.icon} />;

const styles = StyleSheet.create({
  icon: {
    ...LIST_ICON_DIMS
  }
});
