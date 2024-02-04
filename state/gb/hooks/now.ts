import React from "react";
import { londonDateYYYYMMDD, londonTimeHHMMSS } from "../../../utils/dateTime";
import { getStartOfCurrentHalfHour } from "../../utils";

export const NOW_INTERVAL_SECS = 15

export const add29Minutes = (date: Date) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + 29);
  return result;
};

export const getSettlementPeriod = (date: Date) => {
  const settlementDate = londonDateYYYYMMDD(date)
  const HHMMSS = londonTimeHHMMSS(date);
  const hours = parseInt(HHMMSS.slice(0, 2));
  const minutes = parseInt(HHMMSS.slice(3, 5));
  const settlementPeriod = Math.floor(hours * 2 + minutes / 30) + 1;

  return {
    settlementDate,
    settlementPeriod,
  };
};

export const getCurrentSettlementPeriod = (now: Date) => {
  const from = getStartOfCurrentHalfHour(now);
  const to = add29Minutes(from);
  const settlementPeriod = getSettlementPeriod(from);
  return {
    settlementPeriod,
    fromTo: {
      from: from.toISOString(),
      to: to.toISOString(),
    },
  };
};

export const useNowQuery = () => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15000 * NOW_INTERVAL_SECS);
    return () => clearInterval(interval);
  }, []);
  return {
    now,
    args: getCurrentSettlementPeriod(now),
  };
};
