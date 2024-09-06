import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
  calculateCycleSeconds,
} from "@/src/utils/misc";
import { ErrorDataRetryCard } from "../../error-data-retry-card";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import Pagination from "./pagination";
import { useNowQuery } from "@/src/state/api";
import { selectors, setSelectedUnitGroupCode } from "@/src/state/live";
import { RootState } from "@/src/state";

const WEB_PAGE_SIZE = 15;

export const GbUnitGroupsList: React.FC = () => {
  const { data, isLoading, refetch, isError } = useNowQuery(undefined, {
    pollingInterval: 1000 * 60,
    refetchOnReconnect: true,
  });
  const [webPage, setWebPage] = React.useState(0);
  const list = React.useRef<FlashList<{ }>>(null);

  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  React.useEffect(() => {
    if (!selectedUnitGroupCode) return;
    const index = data?.unit_groups!.findIndex(
      (g) => g.code === selectedUnitGroupCode
    );
    if (!index || index < 0) return undefined;
    // make this item the top of the list
    list.current?.scrollToIndex({ index, animated: false });
  }, [selectedUnitGroupCode]);

  const memoData = React.useMemo(() => {
    if (!data || !data.unit_groups) return [];
    if (Platform.OS === "web") {
      return data.unit_groups.slice(
        webPage * WEB_PAGE_SIZE,
        (webPage + 1) * WEB_PAGE_SIZE
      );
    } else {
      return data.unit_groups;
    }
  }, [data, webPage]);

  if (isError && !data) {
    return <ErrorDataRetryCard refetch={refetch} />;
  }

  return (
    <FlashList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={list as any}
      data={memoData}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      keyExtractor={(x) => x.code}
      estimatedItemSize={30}
      renderItem={({ item }) => (
        <UnitGroupsListLiveItem {...item} code={item.code} />
      )}
      // ListHeaderComponent={Platform.OS !== "web" && StaleDataCard}
      ListFooterComponent={
        Platform.OS === "web" ? (
          <Pagination
            currentPage={webPage}
            totalPages={data ? data.unit_groups.length / WEB_PAGE_SIZE : 1}
            onNext={() => setWebPage((p) => p + 1)}
            onPrevious={() => setWebPage((p) => p - 1)}
          />
        ) : undefined
      }
    />
  );
};

const UnitGroupsListLiveItem: React.FC<
  UnitGroupPointInTime
> = (item) => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) =>
    selectors.isSelectedUnitGroupCode(state, item.code)
  );

  return (
    <TouchableOpacity
      onPress={() => dispatch(setSelectedUnitGroupCode(item.code))}
    >
      <GbLiveListItem
        key={item.code}
        cycleSeconds={calculateCycleSeconds(item)}
        name={item.code}
        type={item.fuel_type}
        capacity={item.capacity}
        output={item.output.level}
        delta={item.output.delta}
        balancingVolume={item.balancing_volume}
        balancingDirection={calculateBalancingDirection(item.balancing_volume)}
        capacityFactor={calculateCapacityFactor(item)}
        selected={selected}
      />
    </TouchableOpacity>
  );
};
