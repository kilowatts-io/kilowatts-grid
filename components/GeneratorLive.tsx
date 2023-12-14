import React from "react";
import { ActivityIndicator} from "react-native";
import { useGenerationLiveQuery } from "../services/state/elexon-insights-api";
import {FlashList}  from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import * as at from '../atoms'

export const GeneratorLive = () => {
  const nav = useNavigation()
  const { data, isLoading, updated } = useGenerationLiveQuery();
  React.useEffect(() => {
    nav.setOptions({
      title: `Major Generators Live Output: ${updated.toLocaleTimeString()}`
    })
  }, [data])
  if (isLoading || !data) {
    return <ActivityIndicator />;
  }
  return (
    <FlashList
      data={data}
      estimatedItemSize={1000}
      renderItem={({ item }) => (<at.listItems.GeneratorLive name={item.id} level={item.level} />)}
    />
  );
};
