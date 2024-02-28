import React from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Icon, Text } from "@rneui/themed";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
  calculateCycleSeconds
} from "../../../../state/utils";
import { ErrorDataRetryCard } from "../../error-data-retry-card";
import StaleDataCard from "../../stale-data-card";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import { GbBalancingTotals } from "./balancing-totals/balancing-totals";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const GbTotalsList: React.FC = () => {
  const { data, isLoading, refetch, isError } = useGbSummaryOutputQuery(
    undefined,
    {
      pollingInterval: 1000 * 15,
      refetchOnReconnect: true
    }
  );

  if (isError && !data) {
    return <ErrorDataRetryCard refetch={refetch} />;
  }

  return (
    <FlatList
      data={data && data.totals}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      ListHeaderComponent={Platform.OS !== "web" && StaleDataCard}
      renderItem={({ item }) => (
        <GbLiveListItem
          type={item.code}
          key={`gb-totals-list-item-${item.code}`}
          name={capitalise(item.name)}
          capacity={item.cp}
          output={item.ac}
          delta={item.dl}
          balancingVolume={item.offers - item.bids}
          balancingDirection={calculateBalancingDirection(item)}
          capacityFactor={calculateCapacityFactor(item)}
          cycleSeconds={calculateCycleSeconds(item)}
          selected={false}
        />
      )}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};
