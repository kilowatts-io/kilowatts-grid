import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as t from "../../common/types";
import * as p from "../../common/parsers";
import log from "../log";
import { isLoading } from "expo-font";
import { store, useAppDispatch } from ".";
import { getSettlementPeriod } from "../../common/utils";
import React from "react";

export const elexonInsightsApi = createApi({
  reducerPath: "elexonInsightsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://data.elexon.co.uk/bmrs/api/v1`,
  }),
  endpoints: (builder) => ({
    pnAll: builder.query<
      t.ElexonInsightsPnResponseParsed,
      t.ElexonInsightsPNAllParams
    >({
      query: (p) =>
        `/datasets/pn?settlementDate=${p.settlementDate}${
          p.settlementPeriod ? `&settlementPeriod=${p.settlementPeriod}` : ""
        }`,
      transformResponse: (
        r: t.ElexonInsightsPnResponseRaw
      ): t.ElexonInsightsPnResponseParsed => {
        log.debug(`pnAll: ${r.data.length} records found.. transformResponse`);
        if (r.data.length === 0) {
          throw new Error(`pnAll: not available`);
        }
        let output: t.ElexonInsightsPnResponseParsed = {};
        for (const bmUnit of p.getBmUnits(r.data)) {
          output[bmUnit] = p.intervalRecordToLevelPairs(
            r.data.filter((x) => x.bmUnit === bmUnit)
          );
        }
        log.debug(
          `pnAll: transformResponse complete for ${
            Object.keys(output).length
          } units`
        );
        return output;
      },
    }),
  }),
});

export const { usePnAllQuery } = elexonInsightsApi;

export const useGenerationLiveQuery = () => {
  const [nowTime, setNowTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });
  const pns = usePnAllQuery(getSettlementPeriod(nowTime.toISOString()));
  return {
    isLoading: pns.isLoading,
    data:
      pns.data &&
      p.sortDescendingBmUnitValues(
        p.interpolateBmUnitLevelPairs({
          bmUnitLevelPairs: pns.data,
          time: nowTime.toISOString(),
          omitZero: true,
        })
      ),
  };
};
