import React from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";

import {
  calculateOutputTotals,
  TotalsListOutputItem
} from "../../../../state/gb/calcs/output-totals";
import { selectors } from "../../../../state/gb/live";
import {
  calculateBalancingDirection,
  calculateCapacityFactor
} from "../../icons/tools";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import { GbBalancingTotals } from "./balancing-totals/balancing-totals";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const GbTotalsList: React.FC = () => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  const rawTotals = useSelector(selectors.outputTotals);
  const totals = React.useMemo(
    () => calculateOutputTotals(rawTotals),
    [rawTotals]
  );
  return (
    <FlatList
      data={initialLoadComplete && totals}
      refreshing={!initialLoadComplete}
      renderItem={({ item }) => <GbTotalsListItem item={item} />}
      ListFooterComponent={GbBalancingTotals}
    />
  );
};

interface GbTotalsListItemProps {
  item: TotalsListOutputItem;
}

const GbTotalsListItem: React.FC<GbTotalsListItemProps> = ({ item }) => {
  const name = React.useMemo(() => capitalise(item.key), [item.key]);
  const roundedLevel = React.useMemo(
    () => Math.round(item.level),
    [item.level]
  );
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
      name={name}
      capacity={item.capacity}
      output={roundedLevel}
      delta={roundedDelta}
      balancingVolume={roundedBalancingVolume}
      balancingDirection={balancingDirection}
      capacityFactor={calculateCapacityFactor(item.level, item.capacity)}
      selected={false}
    />
  );
};
