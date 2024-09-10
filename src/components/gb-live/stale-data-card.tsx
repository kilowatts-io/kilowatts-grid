import React from "react";
import { Linking, View } from "react-native";
import { Button, Card, Text } from "@rneui/themed";
import { STALE_THRESHOLD_MINUTES } from "@/src/constants";
import { useDataContext } from "@/src/contexts/data";


const determineIfDataIsStale = (data: AppData) => {
  if (!data) return false;
  const lastUpdated = new Date(data.dt);
  const now = new Date();
  const diff = now.getTime() - lastUpdated.getTime();
  return diff > STALE_THRESHOLD_MINUTES * 60 * 1000;
};

const StaleDataCard: React.FC = () => {
  const { data, refetch } = useDataContext();
  const isStale = determineIfDataIsStale(data);
  if (!isStale) return undefined;
  return (
    <View style={{ paddingBottom: 10 }}>
      <Card>
        <Card.Title>Data Error</Card.Title>
        <Text>
          {`Data shown is from ${new Date(
            Date.parse(data.dt)
          ).toLocaleString()} and is stale/out-of-date. There may be an outage affecting Elexon/BMRS data, our data pipeline, or your internet connection. `}
        </Text>
        <View style={{ height: 20 }} />

        <Button
          type="outline"
          size="sm"
          onPress={() => {
            Linking.openURL("https://elexonexternal.newsweaver.com/");
          }}
        >
          Elexon/BMRS Outage Notices
        </Button>

        <View style={{ height: 10 }} />

        <Button size="sm" onPress={refetch}>
          Retry
        </Button>
      </Card>
    </View>
  );
};
export default StaleDataCard;
