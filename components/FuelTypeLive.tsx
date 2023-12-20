import React from "react";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { useFuelTypeLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { RefreshControl } from "react-native-gesture-handler";
import { IncompleteUnknownCategories } from "../atoms/cards";
import { FuelTypeLive as ListItem } from "../atoms/list-items";
import { Refresh } from "../atoms/controls";

export const FuelTypeLive = () => {
  const nav = useNavigation();
  const { data, isLoading, now, refetch } = useFuelTypeLiveQuery();
  React.useEffect(() => {
    nav.setOptions({
      title: now
        ? `National Grid at: ${now.toLocaleTimeString()}`
        : "Loading...",
    });
  }, [now]);
  return (
    <FlashList
      testID='fuel-type-live-list'
      ListFooterComponent={IncompleteUnknownCategories}
      refreshControl={<Refresh refreshing={isLoading} onRefresh={refetch} />}
      data={data}
      estimatedItemSize={1000}
      renderItem={({ item }) => (
        <ListItem name={item.name} level={item.level} />
      )}
    />
  );
};
