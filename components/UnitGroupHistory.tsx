import React from "react";
import { UnitGroup } from "../common/types";
import log from "../services/log";
import { useUnitGroupHistoryQuery } from "../services/state/elexon-insights-api.hooks";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { UnitGroupHistoryListHeaderComponent } from "../atoms/cards";
import { UnitLevelListItem } from "../atoms/list-items";

type UnitGroupHistoryProps = {
  ug: UnitGroup;
};

export const UnitGroupHistory: React.FC<UnitGroupHistoryProps> = ({ ug }) => {
  log.info(`UnitGroupHistory ${ug.details}`);
  const query = useUnitGroupHistoryQuery(ug);
  const now = new Date();
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={query.isLoading}
          onRefresh={query.refetch}
        />
      }
    >
      {query.data &&
        query.data.map((ug) => {
          const inFuture = ug.data.levels.filter((l) => l.time.localeCompare(now.toISOString()) > 0).sort(
            (a, b) => a.time.localeCompare(b.time)
          )
          return (
            <FlashList
              estimatedItemSize={50}
              key={ug.details.bmUnit}
              ListHeaderComponent={() => (
                <UnitGroupHistoryListHeaderComponent
                  bmUnit={ug.details.bmUnit}
                  average={ug.data.average}
                />
              )}
              data={inFuture}
              renderItem={({ item }) => {
                return <UnitLevelListItem {...item} />;
              }}
            />
          );
        })}
    </ScrollView>
  );
};
