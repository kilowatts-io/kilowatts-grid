// a card that is rendered on the fuel_type screen for wind and solar that describes the total estimated capacity and output of all wind or solar units
import { Text } from "react-native-paper";
import { View } from "react-native";
import { LEFT_WIDTH } from "../hooks/screen";
import { capitalise, formatMW } from "../utils/misc";
import { useFuelType } from "../utils/nav";
import { useEmbeddedTotals } from "../hooks/data";

const EMBEDDED_FUEL_TYPES: FuelType[] = ["wind", "solar"];

const EmbeddedResiduaCard: React.FC = () => {
  const fuel_type = useFuelType();
  const data = useEmbeddedTotals(fuel_type);
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
