import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import { selectors, setSelectedUnitGroupCode } from "../../../../state/gb/live";
import {
  calculateBalancingDirection,
  calculateCapacityFactor
} from "../../../../state/utils";
import { GbLiveListItem } from "../live-list-item/live-list-item";

export const GbUnitGroupsList: React.FC = () => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGbSummaryOutputQuery(undefined, {
    pollingInterval: 1000 * 15,
    refetchOnReconnect: true
  });
  const list = React.useRef<FlashList<{ GbSummaryOutputGenerator }>>(null);
  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  React.useEffect(() => {
    if (!selectedUnitGroupCode) return undefined;
    const index = data.generators.findIndex(
      (g) => g.key === selectedUnitGroupCode
    );
    if (index <= 1) return undefined;
    list.current?.scrollToIndex({
      index: index,
      viewPosition: 0,
      animated: true
    });
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
      renderItem={({ item }) => {
        return (
          <GbLiveListItem
            key={item.key}
            name={item.name}
            type={item.fuel_type}
            capacity={item.cp}
            output={item.ac}
            delta={item.dl}
            balancingVolume={item.bids + item.offers}
            balancingDirection={calculateBalancingDirection(item)}
            capacityFactor={calculateCapacityFactor(item)}
            selected={selectedUnitGroupCode == item.key}
            onPress={() => dispatch(setSelectedUnitGroupCode(item.key))}
          />
        );
      }}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const styles = StyleSheet.create({
  footer: { height: 100 }
});
