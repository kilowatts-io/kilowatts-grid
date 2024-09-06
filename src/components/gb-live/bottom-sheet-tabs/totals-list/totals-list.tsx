import React from "react";
import { FlatList } from "react-native";
import { ErrorDataRetryCard } from "../../error-data-retry-card";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import { GbBalancingTotals } from "./balancing-totals/balancing-totals";
import { useNowQuery } from "@/src/state/api";
import { calculateBalancingDirection, calculateCapacityFactor, calculateCycleSeconds } from "@/src/utils/misc";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const GbTotalsList: React.FC = () => {
  const { data, isLoading, refetch, isError } = useNowQuery(undefined, {
    pollingInterval: 1000 * 60,
    refetchOnReconnect: true,
  });

  if (isError && !data) {
    return <ErrorDataRetryCard refetch={refetch} />;
  }

  return (
    <FlatList
      data={data && data.fuel_types}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      // ListHeaderComponent={Platform.OS !== "web" && StaleDataCard}
      renderItem={({ item }) => (
        <GbLiveListItem
          type={item.code}
          key={`gb-totals-list-item-${item.code}`}
          name={capitalise(item.code)}
          capacity={item.capacity}
          output={item.output.level}
          delta={item.output.delta}
          balancingVolume={item.balancing_volume}
          balancingDirection={calculateBalancingDirection(item.balancing_volume)}
          capacityFactor={calculateCapacityFactor(item)}
          cycleSeconds={calculateCycleSeconds(item)}
          selected={false}
        />
      )}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};
