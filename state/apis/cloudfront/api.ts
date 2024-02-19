import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { GbSummaryOutputResponse } from "./types";

export const BASE_API = `https://di3d4gkiykgeo.cloudfront.net`;

export const kilowattsCloudfront = createApi({
  reducerPath: "kilowattsCloudfront",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
  endpoints: (builder) => ({
    gbSummaryOutput: builder.query<GbSummaryOutputResponse, void>({
      query: () => "/gb/summary_output.json"
    })
  })
});

export const { useGbSummaryOutputQuery } = kilowattsCloudfront;
