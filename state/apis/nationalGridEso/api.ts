import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import * as embeddedSolarAndWind from "./embeddedSolarAndWind";

const BASE_API = `https://api.nationalgrideso.com/api/3`;

export const nationalGridEsoApi = createApi({
  reducerPath: "nationalGridEsoApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
  endpoints: (builder) => ({
    embeddedSolarAndWind: builder.query({
      query: embeddedSolarAndWind.query,
      transformResponse: embeddedSolarAndWind.transformResponse
    })
  })
});

export const { useEmbeddedSolarAndWindQuery } = nationalGridEsoApi;
