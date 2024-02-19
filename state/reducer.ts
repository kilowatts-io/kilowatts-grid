import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { kilowattsCloudfront } from "./apis/cloudfront/api";
import { termsSlice } from "./terms";

const rootReducer = combineReducers({
  kilowattsCloudfront: kilowattsCloudfront.reducer,
  termsSlice: termsSlice.reducer
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false // avoids errors in prod
      }).concat(kilowattsCloudfront.middleware)
  });

export const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type UseAppSelector = (
  selector: (state: RootState) => unknown
) => unknown;

export type AppDispatch = typeof store.dispatch;
