import React from "react";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { useFuelTypeLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { ApiErrorCard, IncompleteUnknownCategories } from "../atoms/cards";
import { FuelTypeLive as ListItem } from "../atoms/list-items";
import { Refresh } from "../atoms/controls";
import { londonTimeHHMMSS } from "../common/utils";

export const FuelTypeLive = () => {
  const nav = useNavigation();
  const query = useFuelTypeLiveQuery();
  React.useEffect(() => {
    nav.setOptions({
      title: query.now
        ? `National Grid at: ${londonTimeHHMMSS(query.now)}`
        : "Loading...",
    });
  }, [query.now]);
  if(query.isError) return <ApiErrorCard refetch={query.refetch}/>
  return (
    <FlashList
      testID='fuel-type-live-list'
      ListFooterComponent={IncompleteUnknownCategories}
      refreshControl={<Refresh refreshing={query.isLoading} onRefresh={query.refetch} />}
      data={query.data}
      estimatedItemSize={1000}
      renderItem={({ item }) => (
        <ListItem name={item.name} level={item.level} />
      )}
    />
  );
};
