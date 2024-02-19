import React from "react";
import { StyleSheet, View } from "react-native";
import { Canvas } from "@shopify/react-native-skia";

import { ErrorBoundaryBlank } from "../../error-boundary";
import { BatteryListIcon } from "../../icons/battery/list-icon";
import { EU as EUFlag } from "../../icons/cables/flags";
import { calculateCycleSeconds } from "../../icons/calcs";
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
}

export const IconView: React.FC<IconViewProps> = (p) => {
  const cycleSeconds = calculateCycleSeconds(p.capacityFactor);
  const props = { cycleSeconds };
  return (
    <View style={styles.icon}>
      <ErrorBoundaryBlank>
        <Canvas style={styles.icon}>
          {p.type === "wind" && <WindListIcon {...props} />}
          {p.type === "battery" && <BatteryListIcon {...props} />}
          {p.type === "solar" && cycleSeconds != 0 && (
            <SolarListIcon {...props} />
          )}
          {p.type === "interconnector" && <EUFlag />}
          {(p.type === "gas" ||
            p.type === "oil" ||
            p.type === "biomass" ||
            p.type === "coal" ||
            p.type === "nuclear" ||
            p.type === "hydro") && (
            <DispatchableListIcon
              {...props}
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
