import { getSettlementPeriod } from "../../common/utils";
import React from "react";
import { usePnAllQuery } from "./elexon-insights-api";
import * as p from "../../common/parsers";
import log from "../log";

export const UPDATE_INTERVAL_LIVE_GENERATION_SECS = 1

export const useGenerationLiveQuery = () => {
  const [nowTime, setNowTime] = React.useState(new Date());
  React.useEffect(() => {
    log.debug(`useGenerationLiveQuery: mounting`);
    const interval = setInterval(() => {
      log.debug(`useGenerationLiveQuery: updating nowTime`);
      setNowTime(new Date());
    }, UPDATE_INTERVAL_LIVE_GENERATION_SECS * 1000);
    return () => {
      log.debug(`useGenerationLiveQuery: dismounting`);
      clearInterval(interval)
    };
  });
  const pns = usePnAllQuery(getSettlementPeriod(nowTime.toISOString()));
  try {
    return {
      updated: pns.data && nowTime,
      isLoading: pns.isLoading,
      refetch: pns.refetch,
      data:
        pns.data ?
        p.sortDescendingBmUnitValues(
          p.interpolateBmUnitLevelPairs({
            bmUnitLevelPairs: pns.data,
            time: nowTime.toISOString(),
            omitZero: true,
          })
        ): []
    };
  } catch(e) {
    log.debug(`useGenerationLiveQuery: caught error: ${e}`)
    return {
      isLoading: pns.isLoading,
      refetch: pns.refetch,
    }
  }

};
