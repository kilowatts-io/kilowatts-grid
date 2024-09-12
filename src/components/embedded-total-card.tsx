// a card that is rendered on the fuel_type screen for wind and solar that describes the total estimated capacity and output of all wind or solar units

import { useLocalSearchParams } from "expo-router";
import { useDataContext } from "../contexts/data";
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import { LEFT_WIDTH } from "../hooks/screen";
import { formatMW } from "./icon-list-item";
import { capitalise } from "../utils/misc";

const EMBEDDED_FUEL_TYPES: FuelType[] = ["wind", "solar"];

const useData = (fuel_type: FuelType) => {
  const data = useDataContext();
  const total = data.data.lists.fuel_types.find(
    (x) => x.fuel_type === fuel_type
  );
  if (!total) return { output: 0, capacity: 0 };

  let bmOutput = 0;
  let bmCapacity = 0;

  for (const unit of data.data.lists.unit_groups) {
    if (unit.fuel_type === fuel_type) {
      bmOutput += unit.output.level;
      bmCapacity += unit.capacity;
    }
  }

  const embeddedOutput = Math.max(0, total.output.level - bmOutput);
  const embeddedCapacity = Math.max(0, total.capacity - bmCapacity);

  return {
    output: embeddedOutput,
    capacity: embeddedCapacity,
  };
};

const EmbeddedResiduaCard: React.FC = () => {
  const fuel_type = useLocalSearchParams().fuel_type as FuelType;
  const data = useData(fuel_type);
  if (!EMBEDDED_FUEL_TYPES.includes(fuel_type)) return null;

  return (
    <View
      style={{
        width: LEFT_WIDTH,
        padding: 10,
      }}
    >
      <Text>
        {`In addition to the units shown on the map, there is ${formatMW(data.capacity)} of ${capitalise(fuel_type)} capacity with an estimated output of ${formatMW(data.output)} which is not shown on the map. This is because the units are too small to be displayed individually and are often not connected directly to the transmission network or metered. The figure shown is a forecast estimate produced by National Grid ESO`}
      </Text>
    </View>
  );
};

export default EmbeddedResiduaCard;
