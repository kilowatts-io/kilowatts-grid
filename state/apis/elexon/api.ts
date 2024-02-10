import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import * as boalf from "./boalf";
import * as mels from "./mels";
import * as pn from "./pn";

export const BASE_API = `https://data.elexon.co.uk/bmrs/api/v1`;

export const elexonApi = createApi({
  reducerPath: "elexonApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
  endpoints: (builder) => ({
    pn: builder.query({
      query: pn.query,
      transformResponse: pn.transformResponse
    }),
    mels: builder.query({
      query: mels.query,
      transformResponse: mels.transformResponse
    }),
    boalf: builder.query({
      query: boalf.query,
      transformResponse: boalf.transformResponse
    })
  })
});

export const { usePnQuery, useMelsQuery, useLazyMelsQuery, useBoalfQuery } =
  elexonApi;
