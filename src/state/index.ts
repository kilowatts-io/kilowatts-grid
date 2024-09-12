import { configureStore, combineReducers } from "@reduxjs/toolkit";
import terms from "./terms";
import search from "./search";
import api from "./api";
import { useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@react-native-async-storage/async-storage"

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['api', 'terms', 'search'],
};

const rootReducer = combineReducers({
  api: api.reducer,
  terms: terms.reducer,
  search: search.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware) as any,
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected,
) => TSelected = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
