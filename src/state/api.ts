import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { EXPO_PUBLIC_DATA_ENDPOINT } from "@env";

export const kilowattsApi = createApi({
  reducerPath: "kilowattsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${EXPO_PUBLIC_DATA_ENDPOINT}`
  }),
  endpoints: (builder) => ({
    now: builder.query<GbPointInTime, void>({
      query: () => ''
    })
  })
});

export const { useNowQuery } = kilowattsApi;
