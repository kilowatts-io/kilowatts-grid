import * as t from "./types";
import log from "../services/log";

export const londonTime = (date: Date) =>
  date.toLocaleString("en-GB", { timeZone: "Europe/London" });

export const getSettlementPeriod = (
  dateString?: string
): t.ElexonSettlementPeriodParams => {
  const date = londonTime(dateString ? new Date(dateString) : new Date());
  // in DD/MM/YYYY, HH:MM:SS format
  const [day, month, year, hour, minute] = date.split(/[\/\s,:]+/);
  const settlementDate = `${year}-${month}-${day}`;
  const settlementPeriod =
    parseInt(hour) * 2 + (parseInt(minute) >= 30 ? 1 : 0) + 1;
  log.debug(
    `getSettlementPeriod: ${settlementDate}:${settlementPeriod} for ${dateString}`
  );
  return {
    settlementDate,
    settlementPeriod,
  };
};

export const getSettlementDate = (dateString?: string): string => {
  const date = londonTime(dateString ? new Date(dateString) : new Date());
  // in DD/MM/YYYY, HH:MM:SS format
  const [day, month, year, hour, minute] = date.split(/[\/\s,:]+/);
  const settlementDate = `${year}-${month}-${day}`;
  return settlementDate;
};

/*
getTodayYesterdaySettlementDates
Get both today's and yesterday's settlement dates to query over the last 24 hours
*/
export const getTodayYesterdaySettlementDates =
  (): t.ElexonSettlementDateParams[] => {
    const today = getSettlementDate();
    const yesterday = getSettlementDate(
      new Date(Date.now() - 86400000).toISOString()
    );
    log.info(
      `getTodayYesterdaySettlementDates: today: ${today}, yesterday: ${yesterday}`
    );
    return [
      {
        settlementDate: today,
      },
      {
        settlementDate: yesterday,
      },
    ];
  };
