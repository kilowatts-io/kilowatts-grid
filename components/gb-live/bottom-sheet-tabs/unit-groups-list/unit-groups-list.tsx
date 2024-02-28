import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";

import { useGbSummaryOutputQuery } from "../../../../state/apis/cloudfront/api";
import { GbSummaryOutputGenerator } from "../../../../state/apis/cloudfront/types";
import { selectors, setSelectedUnitGroupCode } from "../../../../state/gb/live";
import { RootState } from "../../../../state/reducer";
import {
  calculateBalancingDirection,
  calculateCapacityFactor,
  calculateCycleSeconds
} from "../../../../state/utils";
import { ErrorDataRetryCard } from "../../error-data-retry-card";
import StaleDataCard from "../../stale-data-card";
import { GbLiveListItem } from "../live-list-item/live-list-item";

import Pagination from "./pagination";

const WEB_PAGE_SIZE = 15;

export const GbUnitGroupsList: React.FC = () => {
  const { data, isLoading, refetch, isError } = useGbSummaryOutputQuery(
    undefined,
    {
      pollingInterval: 1000 * 15,
      refetchOnReconnect: true
    }
  );
  const [webPage, setWebPage] = React.useState(0);
  const list = React.useRef<FlashList<{ GbSummaryOutputGenerator }>>(null);

  const selectedUnitGroupCode = useSelector(selectors.selectedUnitGroupCode);
  React.useEffect(() => {
    if (!selectedUnitGroupCode) return;
    const index = data.generators.findIndex(
      (g) => g.code === selectedUnitGroupCode
    );
    if (index < 0) return undefined;
    // make this item the top of the list
    list.current?.scrollToIndex({ index, animated: false });
  }, [selectedUnitGroupCode]);

  const memoData = React.useMemo(() => {
    if (!data || !data.generators) return [];
    if (Platform.OS === "web") {
      return data.generators.slice(
        webPage * WEB_PAGE_SIZE,
        (webPage + 1) * WEB_PAGE_SIZE
      );
    } else {
      return data.generators;
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
        <UnitGroupsListLiveItem
          {...item}
          code={item.code}
        />
      )}
      ListHeaderComponent={Platform.OS !== "web" && StaleDataCard}
      ListFooterComponent={
        Platform.OS === "web" ? (
          <Pagination
            currentPage={webPage}
            totalPages={data && data.generators.length / WEB_PAGE_SIZE}
            onNext={() => setWebPage((p) => p + 1)}
            onPrevious={() => setWebPage((p) => p - 1)}
          />
        ) : undefined
      }
    />
  );
};

const UnitGroupsListLiveItem: React.FC<
  GbSummaryOutputGenerator & {
    code: string;
  }
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
        name={item.name}
        type={item.fuel_type}
        capacity={item.cp}
        output={item.ac}
        delta={item.dl}
        balancingVolume={item.offers - item.bids}
        balancingDirection={calculateBalancingDirection(item)}
        capacityFactor={calculateCapacityFactor(item)}
        selected={selected}
      />
    </TouchableOpacity>
  );
};
