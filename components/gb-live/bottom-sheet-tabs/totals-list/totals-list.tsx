import React from "react";
import { FlatList } from "react-native";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import {
  calculateBalancingDirection,
  calculateCapacityFactor
} from "../../../../state/utils";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import { GbBalancingTotals } from "./balancing-totals/balancing-totals";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const GbTotalsList: React.FC = () => {
  const { data, isLoading, refetch } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 1000 * 15,
    refetchOnReconnect: true
  });

  return (
    <FlatList
      data={data && data.totals}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      renderItem={({ item }) => (
        <GbLiveListItem
          type={item.key}
          key={`gb-totals-list-item-${item.key}`}
          name={capitalise(item.name)}
          capacity={item.cp}
          output={item.ac}
          delta={item.dl}
          balancingVolume={item.bids + item.offers}
          balancingDirection={calculateBalancingDirection(item)}
          capacityFactor={calculateCapacityFactor(item)}
          selected={false}
        />
      )}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};
