import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Action } from "@reduxjs/toolkit";
import { RootState } from ".";

export const elexonInsightsApi = createApi({
  reducerPath: "elexonInsightsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `https://data.elexon.co.uk/bmrs/api/v1` }),
  endpoints: (builder) => ({
    search: builder.query({
      query: ({ query }) => `search?query=${query}`,
    }),
  }),
//   refetchOnFocus: true,
//   refetchOnReconnect: true,
});

export const { } =
  elexonInsightsApi;