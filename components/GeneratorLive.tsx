import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useGenerationLiveQuery } from "../services/state/elexon-insights-api";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

export const GeneratorLive = () => {
  const nav = useNavigation()
  const { data, isLoading, updated } = useGenerationLiveQuery();
  React.useEffect(() => {
    nav.setOptions({
      title: `Live Output: ${updated.toLocaleTimeString()}`
    })
  }, [data])
  if (isLoading || !data) {
    return <ActivityIndicator />;
  }
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return (
          <Text style={{ color: "white" }}>
            {item.id} {item.level}MW
          </Text>
        );
      }}
    />
  );
};
