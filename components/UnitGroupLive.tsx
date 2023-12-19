import React from "react";
import { UnitGroup } from "../common/types";
import { useUnitGroupLiveQuery } from "../services/state/elexon-insights-api.hooks";
import log from "../services/log";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";
import { UnitLive } from "../atoms/list-items";
import { UnitListHeader } from "../atoms/cards";
import { UnitGroupMap } from "../atoms/maps";

// import { UnitGroupStack } from "./UnitGroupStack";

type UnitGroupLiveProps = {
  ug: UnitGroup;
};
export const UnitGroupLive: React.FC<UnitGroupLiveProps> = ({ ug }) => {
  log.debug(`UnitGroupLive ${ug.details.name}`);
  const query = useUnitGroupLiveQuery(ug);

  return (
    <>
      <FlashList
        estimatedItemSize={50}
        refreshControl={
          <RefreshControl refreshing={query.isLoading} onRefresh={() => {}} />
        }
        ListHeaderComponent={() => <UnitListHeader now={query.now} />}
        data={query.data}
        renderItem={({ item, index }) => <UnitLive index={index} {...item} />}
        ListFooterComponent={
          <UnitGroupMap ug={ug} />
        }
      />
      
    </>
  );
};
