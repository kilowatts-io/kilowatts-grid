import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as t from "../../common/types";
import * as p from "../../common/parsers";
import * as tr from "./elexon-insights-api.tR";

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
      transformResponse: tr.queries.pnAll,
    }),
  }),
});

export const { usePnAllQuery } = elexonInsightsApi;

