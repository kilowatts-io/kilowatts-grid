import { getSettlementPeriod } from "../../common/utils";
import React from "react";
import { useAccAllQuery, usePnAllQuery } from "./elexon-insights-api";
import * as p from "../../common/parsers";
import log from "../log";
import { AppState } from "react-native";

export const UPDATE_INTERVAL_LIVE_GENERATION_SECS = 1;
export const POLLING_INTERVAL_ACCS_SECS = 15;

export const useUnitGroupLiveQuery = () => {
  const [nowTime, setNowTime] = React.useState(new Date());

  const pns = usePnAllQuery(getSettlementPeriod(nowTime.toISOString()));
  const accs = useAccAllQuery(getSettlementPeriod(nowTime.toISOString()), {
    pollingInterval: POLLING_INTERVAL_ACCS_SECS * 1000,
  });

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
  }, []);

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          log.debug(
            `useGenerationLiveQuery: appStateListener: active -- refetching`
          );
          accs.refetch();
        }
      }
    );
    return () => {
      appStateListener.remove();
    };
  }, []);

  if (!pns.data || !accs.data) {
    return {
      isLoading: pns.isLoading || accs.isLoading,
      refetch: pns.refetch,
    };
  }

  try {
    log.debug(`useGenerationLiveQuery: combining pns and accs`);
    const combined = p.combinePnsAndAccs({
      pns: pns.data,
      accs: accs.data,
    });

    log.debug(`useGenerationLiveQuery: interpolating bmUnitLevelPairs `);

    const units =  p.interpolateBmUnitLevelPairs({
      bmUnitLevelPairs: combined,
      time: nowTime.toISOString(),
      omitZero: true,
    })

    const unitGroups = p.groupByUnitGroup(units)

    return {
      updated: pns.data && nowTime,
      isLoading: pns.isLoading,
      refetch: pns.refetch,
      data: unitGroups.sort((a, b) => b.level - a.level),
    };
  } catch (e) {
    log.debug(`useGenerationLiveQuery: caught error: ${e}`);
    return {
      isLoading: pns.isLoading,
      refetch: pns.refetch,
    };
  }
};

export const useFuelTypeLiveQuery = () => {
  log.debug(`useFuelTypeLiveQuery: mounting`);
  const unitGroups = useUnitGroupLiveQuery();
  if(!unitGroups.data) {
    log.debug(`useFuelTypeLiveQuery: no data`);
    return unitGroups
  } else {
    log.debug(`useFuelTypeLiveQuery: transforming to group by fuel type`);
    return {
      ...unitGroups,
      data: p.groupByFuelTypeAndInterconnectors(unitGroups.data)
    }
  }
}