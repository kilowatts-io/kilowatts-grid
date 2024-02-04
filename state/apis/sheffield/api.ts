import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as national from './national'

const BASE_API = `https://api.solar.sheffield.ac.uk/pvlive/api/v4`;

export const sheffieldApi = createApi({
  reducerPath: "sheffieldApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
  endpoints: (builder) => ({
    national: builder.query({
      query: national.query,
      transformResponse: national.transformResponse
    }),

  }),
});


export const { useNationalQuery } = sheffieldApi;