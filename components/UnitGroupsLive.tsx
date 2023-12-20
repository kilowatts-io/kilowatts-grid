import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import { useUnitGroupsLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { FlashList } from "@shopify/flash-list";
import * as at from "../atoms";
import { IncompleteUnknownCategories } from "../atoms/cards";
import { SearchUnitGroups } from "../atoms/inputs";
import log from "../services/log";
import { StyleSheet } from "react-native";
import { urls } from "../services/nav";
import { Refresh } from "../atoms/controls";

export const UnitGroupsLive = () => {
  log.debug(`UnitGroupsLive`);
  const nav = useNavigation();
  const [search, setSearch] = useState("");

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

export const UnitGroupLiveWithSearch: React.FC<
  UnitGroupLiveWithSearchProps
> = ({ search }) => {
  const router = useRouter();
  const query = useUnitGroupsLiveQuery();

  const { data, now, isLoading, refetch } = query;
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
      title: now
        ? `Major Generators Live Output: ${now.toLocaleTimeString()}`
        : "Loading...",
    });
  }, [query.now]);

  return (
    <FlashList
      refreshControl={
        <Refresh refreshing={isLoading} onRefresh={refetch} />
      }
      ListFooterComponent={IncompleteUnknownCategories}
      data={filteredData}
      estimatedItemSize={1000}
      renderItem={({ item, index }) => {
        const { fuelType, code } = item.details;

        return (
          <at.listItems.GeneratorLive
            index={index}
            fuelType={fuelType}
            name={item.details.name}
            level={item.level}
            onPress={() => {
              if(code && fuelType !== 'interconnector') {
                router.push(urls.unitGroup(code));
              } else {
                log.info(`UnitGroupLiveWithSearch: not possible as no code or interconnector`);
              }
            }}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  linkWrapper: {
    width: "100%",
  },
});
