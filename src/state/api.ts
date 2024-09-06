import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const EXPO_PUBLIC_DATA_ENDPOINT = process.env.EXPO_PUBLIC_DATA_ENDPOINT

export const kilowattsApi = createApi({
  reducerPath: "kilowattsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${EXPO_PUBLIC_DATA_ENDPOINT}`,
  }),
  endpoints: (builder) => ({
    now: builder.query<GbPointInTime, void>({
      query: () => "",
    }),
  }),
});
export default kilowattsApi;
export const { useNowQuery } = kilowattsApi;
