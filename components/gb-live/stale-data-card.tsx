import React from "react";
import { Linking, View } from "react-native";
import { Button, Card, Text } from "@rneui/themed";

import { useGbSummaryOutputQuery } from "../../state/apis/cloudfront/api";
import { GbSummaryOutputResponse } from "../../state/apis/cloudfront/types";

interface StaleDataCardProps {}

const THRESHOLD_MINUTES = 10;

const determineIfDataIsStale = (data: GbSummaryOutputResponse) => {
  return true;
  if (!data) return false;
  const lastUpdated = new Date(data.dt);
  const now = new Date();
  const diff = now.getTime() - lastUpdated.getTime();
  return diff > THRESHOLD_MINUTES * 60 * 1000;
};

const StaleDataCard: React.FC<StaleDataCardProps> = () => {
  const data = useGbSummaryOutputQuery();
  if (!data.currentData) return undefined;
  const isStale = determineIfDataIsStale(data.data);
  if (!isStale) return undefined;
  return (
    <View style={{ paddingBottom: 10 }}>
      <Card>
        <Card.Title>Data Error</Card.Title>
        <Text>
          {`Data shown is from ${new Date(Date.parse(data.data.dt)).toLocaleString()} and is stale/out-of-date. There may be an outage affecting Elexon/BMRS data, our data pipeline, or your internet connection. `}
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

        <Button
          size="sm"
          onPress={() => data.refetch()}
        >
          Retry
        </Button>
      </Card>
    </View>
  );
};
export default StaleDataCard;
