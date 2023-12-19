import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import * as t from "../../common/types";
import * as p from "../../common/parsers";
import * as tr from "./elexon-insights-api.tR";

const extraOptions = {
  maxRetries: 9999999,
};

const queryParams = {
  settlementPeriodToQuery: (p: t.ElexonSettlementDateOrPeriodParams) => {
    return `?settlementDate=${p.settlementDate}${
      p.settlementPeriod ? `&settlementPeriod=${p.settlementPeriod}` : ""
    }`;
  },
  bmUnitsToQuery: (bmUnits?: string[]) => {
    if(!bmUnits) return ""
    return bmUnits.map((bmUnit) => `&bmUnit=${bmUnit}`).join("");
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
    pnAll: builder.query<
      t.ElexonInsightsPnResponseParsed,
      t.ElexonInsightsPNParams
    >({
      query: (p) => `/datasets/pn${queryParams.settlementPeriodToQuery(p)}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.pnAll,
    }),
    accAll: builder.query<
      t.ElexonInsightsAcceptancesResponseParsed,
      t.ElexonInsightsAcceptancesParams
    >({
      query: (p) => `/balancing/acceptances/all${queryParams.settlementPeriodToQuery(p)}${queryParams.bmUnitsToQuery(p.bmUnits)}`,
      transformResponse: tr.queries.accAll,
    }),
  }),
});

export const { usePnAllQuery, useAccAllQuery } = elexonInsightsApi;
