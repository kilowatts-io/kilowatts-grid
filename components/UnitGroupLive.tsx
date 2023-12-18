import React, { useState, useEffect, useMemo } from "react";
import { useUnitGroupsLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import * as at from "../atoms";
import { RefreshControl } from "react-native-gesture-handler";
import { IncompleteUnknownCategories } from "../atoms/cards";
import { SearchUnitGroups } from "../atoms/inputs";

export const UnitGroupLive = () => {
  const [search, setSearch] = useState("");
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({
      title: "Major Generators Live Output",
    });
  }, []);

  return (
    <>
      <SearchUnitGroups value={search} onChangeText={setSearch} />
      <UnitGroupLiveWithSearch search={search} />
    </>
  );
};

type UnitGroupLiveWithSearchProps = {
  search: string;
};

export const UnitGroupLiveWithSearch: React.FC<UnitGroupLiveWithSearchProps> = ({ search }) => {
  const { data, isLoading, updated, refetch } = useUnitGroupsLiveQuery();
  const filteredData = useMemo(() => {
    if (!data) return data;
    if (search === "") return data;
    
    return data.filter((d) =>
      d.details.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({
      title: updated
        ? `Major Generators Live Output: ${updated.toLocaleTimeString()}`
        : "Loading...",
    });
  }, [updated]);

  return (
    <FlashList
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      ListFooterComponent={IncompleteUnknownCategories}
      data={filteredData}
      estimatedItemSize={1000}
      renderItem={({ item, index }) => (
        <at.listItems.GeneratorLive
          index={index}
          fuelType={item.details.fuelType}
          name={item.details.name}
          level={item.level}
        />
      )}
    />
  );
};
