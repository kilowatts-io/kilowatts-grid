import React from "react";
import { FlatList } from "react-native";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import {
  calculateBalancingDirection,
  calculateCapacityFactor
} from "../../icons/tools";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import { GbBalancingTotals } from "./balancing-totals/balancing-totals";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface WithBalancingVolumes {
  bids: number;
  offers: number;
}
const calculateBalancingDirection = ({
  bids,
  offers
}: WithBalancingVolumes) => {
  const net = bids - offers;
  if (net === 0) return "none";
  if (net > 0) {
    return "offer";
  }
  return "bid";
};

interface WithCapacityFactor {
  ac: number;
  cp: number;
}

const calculateCapacityFactor = ({ ac, cp }: WithCapacityFactor) => {
  if (cp === 0) return 0;
  if (ac === 0) return 0;
  if (ac > 0) {
    return Math.min(1, cp / ac);
  }
  return Math.max(-1, cp / ac);
};

export const GbTotalsList: React.FC = () => {
  const { data, isLoading } = useGbSummaryOutputQuery();

  return (
    <FlatList
      data={data && data.totals}
      refreshing={isLoading}
      renderItem={({ item }) => {
        const roundedDelta = React.useMemo(
          () => Math.round(item.delta),
          [item.delta]
        );
        const roundedBalancingVolume = React.useMemo(
          () => Math.round(item.balancingVolume),
          [item.balancingVolume]
        );
        const balancingDirection = React.useMemo(
          () => calculateBalancingDirection(item.balancingVolume),
          [item.balancingVolume]
        );
        return (
          <GbLiveListItem
            type={item.key}
            key={`gb-totals-list-item-${item.key}`}
            name={item.name}
            capacity={item.ac}
            output={item.ac}
            delta={roundedDelta}
            balancingVolume={roundedBalancingVolume}
            balancingDirection={calculateBalancingDirection(item)}
            capacityFactor={calculateCapacityFactor(item)}
            selected={false}
          />
        );
      }}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};
