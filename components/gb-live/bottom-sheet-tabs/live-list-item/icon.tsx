import React from "react";
import { View, StyleSheet } from "react-native";
import { Canvas } from "@shopify/react-native-skia";
import { LIST_ICON_CX, LIST_ICON_CY, LIST_ICON_DIMS } from "../../icons/list-icons";
import { GbWindMapListIcon } from "../../icons/wind/country/gb";
import { calculateCycleSeconds } from "../../icons/calcs";
import { DispatchableListIcon } from "../../icons/dispatchable/list-icon";
import { BatteryListIcon } from "../../icons/battery/list-icon";
import SolarListIcon from "../../icons/solar/list-icon";
import {EU as EUFlag} from "../../icons/cables/flags";

interface IconViewProps {
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
  capacityFactor: number;
  balancingDirection: "offer" | "bid" | "none";
}

export const IconView: React.FC<IconViewProps> = (p) => {
  const cycleSeconds = calculateCycleSeconds(p.capacityFactor);
  const props = {cycleSeconds}
  return (
    <View style={styles.icon}>
      <Canvas style={styles.icon}>
        {p.type === "wind" && <GbWindMapListIcon {...props} />}
        {p.type === 'battery' && <BatteryListIcon {...props} />}
        {(p.type === 'solar' && cycleSeconds!= 0 ) && <SolarListIcon {...props} />}
        {p.type === 'interconnectors' && <EUFlag />}
        {(p.type === "gas" || p.type === 'biomass' || p.type === 'coal' || p.type === 'nuclear' || p.type === 'hydro') && <DispatchableListIcon {...props} type={p.type}/>}
      </Canvas>
    </View>
  );
};

export const IconViewEmpty = () => <View style={styles.icon} />;

const styles = StyleSheet.create({
  icon: {
    ...LIST_ICON_DIMS,
  },
});
