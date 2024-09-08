import React from "react";
import { useNowQuery } from "@/src/state/api";
import { DATA_REFRESH_INTERVAL_MS } from "../constants";
import LoadingScreen from "../atoms/loading";
import { AppErrorScreen } from "@/src/components/error-boundary";

const data: AppData = {
  dt: new Date().toISOString(),
  map: {
    unit_groups: [],
    foreign_markets: [],
  },
  lists: {
    fuel_types: [],
    unit_groups: [],
    balancing_totals: {
      bids: 0,
      offers: 0,
    },
  },
};

const DataContext = React.createContext<DataContext>({
  data,
  isLoading: false,
  refetch: () => {},
  onRefresh: () => {},
  refreshing: false,
});

export const WithAppData: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data, refetch, isLoading, error } = useNowQuery(undefined, {
    pollingInterval: DATA_REFRESH_INTERVAL_MS,
  });

  if (!data) return <LoadingScreen refetch={refetch} />;

  if (error)
    return (
      <AppErrorScreen
        error={Error(`Did not correctly fetch data from API.`)}
        resetError={refetch}
      />
    );

  const ctx: DataContext = {
    data,
    refetch,
    isLoading,
    onRefresh: refetch,
    refreshing: isLoading,
  };

  return <DataContext.Provider value={ctx}>{children}</DataContext.Provider>;
};

export const useDataContext = () => React.useContext(DataContext);
