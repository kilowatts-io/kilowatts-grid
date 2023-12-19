import {
  useAccSpQuery,
  usePnSpQuery,
  usePnRangeQuery,
  useAccRangeQuery,
} from "./elexon-insights-api";
import * as p from "../../common/parsers";
import log from "../log";
import { UnitGroup } from "../../common/types";
import {
  useNowSettlementPeriod,
  useRecentHistoryElexonRange,
  useRefetchOnAppOrNetworkResume,
} from "../hooks";

export const UPDATE_INTERVAL_LIVE_GENERATION_SECS = 1;
export const POLLING_INTERVAL_ACCS_SECS = 15;
export const MAX_RETRIES = 99999999;

type UseBmUnitsLiveQueryParams = {
  bmUnits?: string[];
};
const useBmUnitsLiveQuery = ({ bmUnits }: UseBmUnitsLiveQueryParams) => {
  const { settlementPeriod, now } = useNowSettlementPeriod(
    UPDATE_INTERVAL_LIVE_GENERATION_SECS
  );
  const queryParams = {
    ...settlementPeriod,
    bmUnits,
  };
  const pns = usePnSpQuery(queryParams);
  const accs = useAccSpQuery(queryParams, {
    pollingInterval: POLLING_INTERVAL_ACCS_SECS * 1000,
  });

  const baseParams = {
    refetch: () => {
      log.debug(`useUnitGroupLiveQuery: refetching`);
      pns.refetch();
      accs.refetch();
    },
    isLoading: pns.isLoading || accs.isLoading,
    data: null,
  };

  useRefetchOnAppOrNetworkResume(baseParams);

  return {
    baseParams,
    pns,
    accs,
    now,
  };
};

export const useUnitGroupsLiveQuery = () => {
  const { baseParams, pns, accs, now } = useBmUnitsLiveQuery({
    bmUnits: undefined,
  });

  if (!pns.data || !accs.data) {
    log.debug(`useUnitGroupLiveQuery: no data`);
    return {
      ...baseParams,
      now: null,
    };
  } else {
    log.debug(`useUnitGroupLiveQuery: has data - trying to parse and combine`);
    try {
      return {
        ...baseParams,
        now,
        data: p.transformUnitGroupsLiveQuery({
          pns: pns.data,
          accs: accs.data,
          now,
        }),
      };
    } catch (e) {
      log.debug(`useUnitGroupLiveQuery: caught error: ${e}`);
      return {
        ...baseParams,
        isError: true,
        now: null,
      };
    }
  }
};

/*
useFuelTypeLiveQuery
Get the latest data for output in each fuel type category
*/
export const useFuelTypeLiveQuery = () => {
  log.debug(`useFuelTypeLiveQuery: mounting`);
  const unitGroups = useUnitGroupsLiveQuery();
  if (!unitGroups.data) {
    log.debug(`useFuelTypeLiveQuery: no data`);
    return unitGroups;
  } else {
    log.debug(`useFuelTypeLiveQuery: transforming to group by fuel type`);
    return {
      ...unitGroups,
      data: p.groupByFuelTypeAndInterconnectors(unitGroups.data),
    };
  }
};

/*
useUnitGroupLiveQuery
Get the latest data for a single unit grou
*/
export const useUnitGroupLiveQuery = (ug: UnitGroup) => {
  log.debug(`useUnitGroupLiveQuery: mounting`);
  const bmUnits = ug.units.map((u) => u.bmUnit);
  const query = useBmUnitsLiveQuery({ bmUnits });
  if (!query.pns.data || !query.accs.data) {
    log.debug(`useUnitGroupLiveQuery: no data`);
    return {
      data: null,
      isLoading: true,
    };
  } else {
    log.debug(`useUnitGroupLiveQuery: has data`);
    return {
      now: query.now,
      isLoading: false,
      data: p.transformUnitGroupLiveQuery({
        pns: query.pns.data,
        accs: query.accs.data,
        now: query.now,
        units: ug.units,
      }),
    };
  }
};

/*
useUnitGroupHistoryQuery
Get the data for a single unit group, going back over the last 24 hours
*/
export const useUnitGroupHistoryQuery = (ug: UnitGroup) => {
  const twentyFourHoursAgo = new Date(Date.now() - 86400000);

  const bmUnits = ug.units.map((u) => u.bmUnit);
  log.debug(
    `useUnitGroupHistoryQuery: mounting,, will track ${
      bmUnits.length
    } bmUnits: ${bmUnits.join(", ")}`
  );


  const params = {
    ...useRecentHistoryElexonRange(),
    bmUnits,
  };

  log.debug(`useUnitGroupHistoryQuery: establishing queries with params ${JSON.stringify(params)}`);

  const queries = {
    pn: usePnRangeQuery(params),
    acc: useAccRangeQuery(params),
  };

  const baseParams = {
    isLoading: queries.pn.isLoading || queries.acc.isLoading,
    refetch: () => {
      log.debug(`useUnitGroupHistoryQuery: refetching`);
      queries.pn.refetch();
      queries.acc.refetch();
    },
    data: null,
  };

  useRefetchOnAppOrNetworkResume(baseParams);

  if (baseParams.isLoading || !queries.pn.data || !queries.acc.data) {
    return baseParams;
  }

  try {
    return {
      ...baseParams,
      data: p.transformUnitHistoryQuery({
        pns: queries.pn.data,
        accs: queries.acc.data,
        truncateBefore: twentyFourHoursAgo,
        units: ug.units,
      }),
    };
  } catch (e) {
    log.debug(`useUnitGroupHistoryQuery: caught error: ${e}`);
    return {
      ...baseParams,
      isError: true,
    };
  }
};
