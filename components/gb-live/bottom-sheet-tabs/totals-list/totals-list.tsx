import React from "react";
import { FlashList } from "@shopify/flash-list";
import { calculateOutputTotals } from "../../../../state/gb/calcs/output-totals";
import { useSelector } from "react-redux";
import { selectors } from "../../../../state/gb/live";
import { GbBalancingTotals } from "./balancing-totals/balancing-totals";
import { GbLiveListItem } from "../live-list-item/live-list-item";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
} from "../../icons/tools";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const GbTotalsList = () => {
  const initialLoadComplete = useSelector(selectors.initialLoadComplete);
  const rawTotals = useSelector(selectors.outputTotals);
  const totals = React.useMemo(
    () => calculateOutputTotals(rawTotals),
    [rawTotals]
  );
  return (
    <FlashList
      data={initialLoadComplete &&totals}
      refreshing={!initialLoadComplete}
      renderItem={({ item }) => (
        <GbLiveListItem
          type={item.key}
          key={`gb-totals-list-item-${item.key}`}
          name={capitalise(item.key)}
          {...item}
          capacity={item.capacity}
          output={item.level}
          delta={item.delta}
          balancingVolume={item.balancingVolume}
          balancingDirection={calculateBalancingDirection(item.balancingVolume)}
          capacityFactor={calculateCapacityFactor(item.level, item.capacity)}
          selected={false}
        />
      )}
      ListFooterComponent={GbBalancingTotals}
      estimatedItemSize={75}
    />
  );
};
