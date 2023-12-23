import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { elexonInsightsApi } from "./elexon-insights-api";
import { ngEsoApi } from "./ng-eso-api";
import { favouritesSlice } from "./favourites";
import { termsSlice } from "./terms";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// configureStore.js

import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  elexonInsightsApi: elexonInsightsApi.reducer,
  ngEsoApi: ngEsoApi.reducer,
  // favouritesSlice: favouritesSlice.reducer, disabled for now
  termsSlice: termsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const persistedStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(elexonInsightsApi.middleware)
      .concat(ngEsoApi.middleware),
});

// used for testing

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(elexonInsightsApi.middleware)
      .concat(ngEsoApi.middleware),
})

export const persistor = persistStore(persistedStore);

export type AppDispatch = typeof persistedStore.dispatch;
export type RootState = ReturnType<typeof persistedStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
