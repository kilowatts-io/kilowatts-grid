import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getSettlementPeriod } from "../common/utils";
import { useGenerationLiveQuery } from "../services/state/elexon-insights-api";
import { FlatList } from "react-native-gesture-handler";

export const GeneratorLive = () => {
  const nowTime = new Date().toISOString();
  const { settlementDate, settlementPeriod } = getSettlementPeriod(nowTime);
  const { data, isLoading } = useGenerationLiveQuery();
  // const {
  //   data,
  //   isLoading
  // } = usePnAllQuery({
  //   settlementDate,
  //   settlementPeriod
  // })
  if (isLoading || !data) {
    return <ActivityIndicator />;
  }
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return (
          <Text style={{ color: "white" }}>
            {item.id} {item.level}
          </Text>
        );
      }}
    />
  );
};
