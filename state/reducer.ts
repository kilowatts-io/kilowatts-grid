import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { elexonApi } from "./apis/elexon/api";
import { nationalGridDemandForeastApi } from "./apis/nationalGridDemandForecast/api";
import { nationalGridEsoApi } from "./apis/nationalGridEso/api";
import { sheffieldApi } from "./apis/sheffield/api";
import { gbLiveSlice } from "./gb/live";
import { termsSlice } from "./terms";

const rootReducer = combineReducers({
  elexonApi: elexonApi.reducer,
  sheffieldApi: sheffieldApi.reducer,
  nationalGridDemandForeastApi: nationalGridDemandForeastApi.reducer,
  nationalGridEsoApi: nationalGridEsoApi.reducer,
  termsSlice: termsSlice.reducer,
  gbLiveSlice: gbLiveSlice.reducer
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false // avoids errors in prod
      })
        .concat(elexonApi.middleware)
        .concat(sheffieldApi.middleware)
        .concat(nationalGridEsoApi.middleware)
        .concat(nationalGridDemandForeastApi.middleware)
  });

export const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type UseAppSelector = (selector: (state: RootState) => any) => any;

export type AppDispatch = typeof store.dispatch;
