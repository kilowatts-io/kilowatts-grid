import React from "react";
import { UnitGroup } from "../common/types";
import log from "../services/log";
import { useUnitGroupScheduleQuery } from "../services/state/elexon-insights-api.hooks";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { ApiErrorCard, UnitGroupScheduleHeader } from "../atoms/cards";
import { UnitLevelListItem } from "../atoms/list-items";

type UnitGroupScheduleProps = {
  ug: UnitGroup;
};

export const UnitGroupSchedule: React.FC<UnitGroupScheduleProps> = ({ ug }) => {
  log.info(`UnitGroupSchedule ${ug.details}`);
  const query = useUnitGroupScheduleQuery(ug);
  if (query.isError) return <ApiErrorCard refetch={query.refetch} />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={query.isLoading}
          onRefresh={query.refetch}
        />
      }
    >
      {query.data && (
        <>
          {query.data.length > 0 &&
            query.data.map((ug) => {
              return (
                <FlashList
                  estimatedItemSize={50}
                  key={ug.details.bmUnit}
                  data={ug.data.levels}
                  ListHeaderComponent={() => (
                    <UnitGroupScheduleHeader bmUnit={ug.details.bmUnit} />
                  )}
                  renderItem={({ item }) => {
                    return <UnitLevelListItem {...item} />;
                  }}
                />
              );
            })}
            
        </>
      )}
    </ScrollView>
  );
};
