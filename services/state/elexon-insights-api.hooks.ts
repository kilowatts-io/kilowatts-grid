import { getSettlementPeriod, getTodayYesterdaySettlementDates } from "../../common/utils";
import React from "react";
import { useAccAllQuery, usePnAllQuery } from "./elexon-insights-api";
import * as p from "../../common/parsers";
import log from "../log";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { UnitGroup } from "../../common/types";

export const UPDATE_INTERVAL_LIVE_GENERATION_SECS = 1;
export const POLLING_INTERVAL_ACCS_SECS = 15;
export const MAX_RETRIES = 99999999;

export const useUnitGroupsLiveQuery = () => {
  const [nowTime, setNowTime] = React.useState(new Date());

  const pns = usePnAllQuery(getSettlementPeriod(nowTime.toISOString()));
  const accs = useAccAllQuery(getSettlementPeriod(nowTime.toISOString()), {
    pollingInterval: POLLING_INTERVAL_ACCS_SECS * 1000,
  });

  const refetch = () => {
    log.debug(`useGenerationLiveQuery: refetching`);
    pns.refetch();
    accs.refetch();
  };

  React.useEffect(() => {
    log.debug(`useGenerationLiveQuery: mounting`);

    const interval = setInterval(() => {
      log.debug(`useGenerationLiveQuery: updating nowTime`);
      setNowTime(new Date());
    }, UPDATE_INTERVAL_LIVE_GENERATION_SECS * 1000);
    return () => {
      log.debug(`useGenerationLiveQuery: dismounting`);
      clearInterval(interval);
    };
  }, [setNowTime]);

  // retry on app resume
  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          log.debug(
            `useGenerationLiveQuery: appStateListener: active -- refetching`
          );
          refetch();
        }
      }
    );
    return () => {
      appStateListener.remove();
    };
  }, []);
  // retry if intermet restored

  React.useEffect(() => {
    const netInfoListener = NetInfo.addEventListener((state) => {
      if (
        (state.isConnected && !pns.data) ||
        (!accs.data && !pns.isLoading && !accs.isLoading)
      ) {
        log.debug(`useGenerationLiveQuery: netInfoListener: connected`);
        refetch();
      }
    });
    return () => {
      netInfoListener();
    };
  });

  if (!pns.data || !accs.data) {
    return {
      isLoading: pns.isLoading || accs.isLoading,
      refetch,
    };
  }

  try {
    log.debug(`useGenerationLiveQuery: combining pns and accs`);
    const combined = p.combinePnsAndAccs({
      pns: pns.data,
      accs: accs.data,
    });

    log.debug(`useGenerationLiveQuery: interpolating bmUnitLevelPairs `);

    const unitGroups = p.groupByUnitGroup(
      p.interpolateBmUnitLevelPairs({
        bmUnitLevelPairs: combined,
        time: nowTime.toISOString(),
        omitZero: true,
      })
    );

    return {
      updated: pns.data && nowTime,
      isLoading: pns.isLoading,
      refetch,
      data: unitGroups.sort((a, b) => b.level - a.level),
    };
  } catch (e) {
    log.debug(`useGenerationLiveQuery: caught error: ${e}`);
    return {
      isLoading: pns.isLoading,
      refetch,
    };
  }
};

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
Get the latest data for a single unit group, going back over the last 24 hours
*/
export const useUnitGroupLiveQuery = (ug: UnitGroup) => {
  // const [nowTime, setNowTime] = React.useState(new Date())
  const twentyFourHoursAgo = new Date(Date.now() - 86400000)

  const bmUnits = ug.units.map((u) => u.bmUnit);
  log.debug(
    `useUnitGroupLiveQuery: mounting,, will track ${
      bmUnits.length
    } bmUnits: ${bmUnits.join(", ")}`
  );
  const [yesterday, today] = getTodayYesterdaySettlementDates();

  const queries = {
    pn: {
      today: usePnAllQuery({...today, bmUnits}),
      yesterday: usePnAllQuery({...yesterday, bmUnits}),
    },
    acc: {
      today: useAccAllQuery({...today, bmUnits}),
      yesterday: useAccAllQuery({...yesterday, bmUnits}),
    },
  }

  const isLoading = queries.pn.today.isLoading || queries.pn.yesterday.isLoading || queries.acc.today.isLoading || queries.acc.yesterday.isLoading

  const refetch = () => {
    if(!isLoading) {
      log.debug(`useGenerationLiveQuery: refetching today queries`);
      queries.pn.today.refetch()
      queries.acc.today.refetch()
    } else {
      log.debug(`useGenerationLiveQuery: not refetching today queries as already loading`)
    }
  };

  // retry on app resume
  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          log.debug(
            `useGenerationLiveQuery: appStateListener: active -- refetching`
          );
          refetch();
        }
      }
    );
    return () => {
      appStateListener.remove();
    };
  }, []);
  // retry if intermet restored

  if (isLoading) {
    return {
      isLoading: true,
      refetch,
    };
  }

  try {
    log.debug(`useGenerationLiveQuery: combining pns and accs`);
    if(!queries.pn.today.data || !queries.pn.yesterday.data || !queries.acc.today.data || !queries.acc.yesterday.data) {
      throw new Error(`useGenerationLiveQuery: missing data`)
    }
    log.debug(`useGenerationLiveQuery: joining pns and accs`);
    const joined = {
      pns: p.joinBmUnitLevelPairs(queries.pn.today.data, queries.pn.yesterday.data),
      accs: p.joinAccs(queries.acc.today.data, queries.acc.yesterday.data)
    }
    log.debug(`useGenerationLiveQuery: combining pns and accs`);
    const combined = p.combinePnsAndAccs(joined);

    log.debug(`useGenerationLiveQuery: removing any values before ${twentyFourHoursAgo}`);
    const filtered = p.filterBefore(combined, twentyFourHoursAgo)

    log.debug(`useGenerationLiveQuery: joining with ug.units`);
    const unitData = ug.units.map((u) => {
      const bmUnitData = filtered[u.bmUnit]
      return {
        ...u,
        name: u.name || u.bmUnit,
        data: {
          levels: bmUnitData,
          average: p.averageLevel(bmUnitData)
        }
      }
    })

    log.debug(`useGenerationLiveQuery: sort by average level `);
    unitData.sort((a, b) => {
      if(a.data.average && b.data.average) {
        return b.data.average - a.data.average
      } else if(a.data.average) {
        return -1
      } else if(b.data.average) {
        return 1
      } else {
        return 0
      }
    })
    
    return {
      isLoading: false,
      refetch,
      data: unitData
    };
  } catch (e) {
    log.debug(`useGenerationLiveQuery: caught error: ${e}`);
    return {
      isLoading: false,
      refetch,
    };
  }
};
