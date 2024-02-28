import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { EXPO_PUBLIC_CDN_DOMAIN_NAME } from "@env";

// import Constants from "expo-constants";
import { GbSummaryOutputResponse } from "./types";

export const kilowattsCloudfront = createApi({
  reducerPath: "kilowattsCloudfront",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://gridcdn.kilowatts.io`
  }),
  endpoints: (builder) => ({
    gbSummaryOutput: builder.query<GbSummaryOutputResponse, void>({
      query: () => "/gb/summary_output.json"
    })
  })
});

export const { useGbSummaryOutputQuery } = kilowattsCloudfront;
