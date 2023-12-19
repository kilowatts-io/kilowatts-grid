import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import * as t from "../../common/types";
import * as p from "../../common/parsers";
import * as tr from "./elexon-insights-api.tR";

const extraOptions = {
  maxRetries: 9999999,
};

const queryParams = {
  settlementPeriodToQuery: (p: t.ElexonSettlementPeriodParams) => {
    return `?settlementDate=${p.settlementDate}${
      p.settlementPeriod ? `&settlementPeriod=${p.settlementPeriod}` : ""
    }`;
  },
  bmUnitsToQuery: (bmUnits?: string[]) => {
    if (!bmUnits) return "";
    return bmUnits.map((bmUnit) => `&bmUnit=${bmUnit}`).join("");
  },
  rangeToQuery: (p: t.ElexonRangeParams) => {
    let query = `?from=${p.from}&to=${p.to}`;
    if (p.settlementPeriodFrom)
      query += `&settlementPeriodFrom=${p.settlementPeriodFrom}`;
    if (p.settlementPeriodTo)
      query += `&settlementPeriodTo=${p.settlementPeriodTo}`;
    return query;
  },
};

export const elexonInsightsApi = createApi({
  reducerPath: "elexonInsightsApi",
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: `https://data.elexon.co.uk/bmrs/api/v1`,
    }),
    extraOptions
  ),
  endpoints: (builder) => ({
    pnSp: builder.query<
      t.ElexonInsightsPnResponseParsed,
      t.ElexonInsightsPnSpParams
    >({
      query: (p) =>
        `/datasets/pn${queryParams.settlementPeriodToQuery(
          p
        )}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.pnAll,
    }),
    pnRange: builder.query<
      t.ElexonInsightsPnResponseParsed,
      t.ElexonInsightsPnRangeParams
    >({
      query: (p) =>
        `/datasets/pn/stream${queryParams.rangeToQuery(
          p
        )}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.pnRange,
    }),
    accSp: builder.query<
      t.ElexonInsightsAcceptancesResponseParsed,
      t.ElexonInsightsAcceptancesSpParams
    >({
      query: (p) =>
        `/balancing/acceptances/all${queryParams.settlementPeriodToQuery(
          p
        )}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.accAll,
    }),
    accRange: builder.query<
      t.ElexonInsightsAcceptancesResponseParsed,
      t.ElexonInsightsAcceptancesRangeParams
    >({
      query: (p) =>
        `/datasets/boalf/stream${queryParams.rangeToQuery(
          p
        )}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.accRange,
    }),
  }),
});

export const {
  usePnSpQuery,
  useAccSpQuery,
  usePnRangeQuery,
  useAccRangeQuery,
} = elexonInsightsApi;
