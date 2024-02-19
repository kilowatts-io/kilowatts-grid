import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import { GbSummaryOutputGenerator } from "../../../../state/apis/cloudfront/types";
import { selectors, setSelectedUnitGroupCode } from "../../../../state/gb/live";
import { RootState } from "../../../../state/reducer";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
  calculateCycleSeconds
} from "../../../../state/utils";
import { GbLiveListItem } from "../live-list-item/live-list-item";

export const GbUnitGroupsList: React.FC = () => {
  const { data, isLoading, refetch } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 1000 * 15,
    refetchOnReconnect: true
  });
  const list = React.useRef<FlashList<{ GbSummaryOutputGenerator }>>(null);
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  React.useEffect(() => {
    if (!selectedUnitGroupCode) return;
    const index = data.generators.findIndex(
      (g) => g.key === selectedUnitGroupCode
    );
    if (index < 0) return undefined;
    // make this item the top of the list
    list.current?.scrollToIndex({ index, animated: false });
  }, [selectedUnitGroupCode]);
  return (
    <FlashList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={list as any}
      data={data && data.generators}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      keyExtractor={(x) => x.key}
      estimatedItemSize={30}
      renderItem={({ item }) => (
        <UnitGroupsListLiveItem
          {...item}
          code={item.key}
        />
      )}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const styles = StyleSheet.create({
  footer: { height: 100 }
});

const UnitGroupsListLiveItem: React.FC<
  GbSummaryOutputGenerator & {
    code: string;
  }
> = (item) => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) =>
    selectors.isSelectedUnitGroupCode(state, item.code)
  );

  return (
    <TouchableOpacity
      onPress={() => dispatch(setSelectedUnitGroupCode(item.code))}
    >
      <GbLiveListItem
        key={item.key}
        cycleSeconds={calculateCycleSeconds(item)}
        name={item.name}
        type={item.fuel_type}
        capacity={item.cp}
        output={item.ac}
        delta={item.dl}
        balancingVolume={item.offers - item.bids}
        balancingDirection={calculateBalancingDirection(item)}
        capacityFactor={calculateCapacityFactor(item)}
        selected={selected}
      />
    </TouchableOpacity>
  );
};
