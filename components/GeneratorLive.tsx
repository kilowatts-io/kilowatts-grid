import React from "react";
import { ActivityIndicator } from "react-native";
import { useGenerationLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import * as at from "../atoms";
import { RefreshControl } from "react-native-gesture-handler";

export const GeneratorLive = () => {
  const nav = useNavigation();
  const { data, isLoading, updated, refetch } = useGenerationLiveQuery();
  React.useEffect(() => {
    nav.setOptions({
      title: updated
        ? `Major Generators Live Output: ${updated.toLocaleTimeString()}`
        : "Loading...",
    });
  }, [updated]);
  if (isLoading || !data) {
    return <ActivityIndicator />;
  }
  return (
    <FlashList
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      data={data}
      estimatedItemSize={1000}
      renderItem={({ item }) => (
        <at.listItems.GeneratorLive name={item.details.name} level={item.level} />
      )}
    />
  );
};
