import { getSettlementPeriod } from "../../common/utils";
import React from "react";
import { useAccAllQuery, usePnAllQuery } from "./elexon-insights-api";
import * as p from "../../common/parsers";
import log from "../log";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const UPDATE_INTERVAL_LIVE_GENERATION_SECS = 1;
export const POLLING_INTERVAL_ACCS_SECS = 15;
export const MAX_RETRIES = 99999999

export const useUnitGroupsLiveQuery = () => {
  const [nowTime, setNowTime] = React.useState(new Date());

  const pns = usePnAllQuery(getSettlementPeriod(nowTime.toISOString()));
  const accs = useAccAllQuery(getSettlementPeriod(nowTime.toISOString()), {
    pollingInterval: POLLING_INTERVAL_ACCS_SECS * 1000,
  });

  const refetch = () => {
    log.info(`useGenerationLiveQuery: refetching`);
    pns.refetch();
    accs.refetch();
  }

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
          log.info(
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
      if (state.isConnected && !pns.data || !accs.data && !pns.isLoading && !accs.isLoading) {
        log.info(`useGenerationLiveQuery: netInfoListener: connected`);
        refetch();
      }
    });
    return () => {
      netInfoListener();
    };
  })

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

    const unitGroups = p.groupByUnitGroup(p.interpolateBmUnitLevelPairs({
      bmUnitLevelPairs: combined,
      time: nowTime.toISOString(),
      omitZero: true,
    }))

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

