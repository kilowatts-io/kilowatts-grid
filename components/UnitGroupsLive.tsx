import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigation } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import { useUnitGroupsLiveQuery } from "../services/state/elexon-insights-api.hooks";
import { FlashList } from "@shopify/flash-list";
import * as at from "../atoms";
import { IncompleteUnknownCategories } from "../atoms/cards";
import { SearchUnitGroups } from "../atoms/inputs";
import log from "../services/log";
import { StyleSheet } from "react-native";
import { urls } from "../services/nav";

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
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      ListFooterComponent={IncompleteUnknownCategories}
      data={filteredData}
      estimatedItemSize={1000}
      renderItem={({ item, index }) => {
        const { fuelType, code } = item.details;
        const listItem = (
          <at.listItems.GeneratorLive
            index={index}
            fuelType={fuelType}
            name={item.details.name}
            level={item.level}
          />
        );
        return code ? (
          <Link
            style={styles.linkWrapper}
            disabled={fuelType === "interconnector"}
            href={code && urls.unitGroup(code)}
          >
            {listItem}
          </Link>
        ) : (
          listItem
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
