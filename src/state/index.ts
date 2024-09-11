import { configureStore, combineReducers } from "@reduxjs/toolkit";
import terms from "./terms";
import api from "./api";
import live from "./live";
import { useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@react-native-async-storage/async-storage"

// 1. Setup persist configuration
const persistConfig = {
  key: 'root',           // The key to persist in local storage
  storage,               // Define storage mechanism, here we use localStorage
  whitelist: ['terms', 'live'], // Reducers you want to persist (leave out 'api' if it's dynamic)
};

// 2. Combine reducers
const rootReducer = combineReducers({
  api: api.reducer,
  terms: terms.reducer,
  live: live.reducer,
});

// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware) as any,
});

// 5. Set up redux-persist to handle the store persistence
export const persistor = persistStore(store); // this is needed to trigger rehydration

// Set up listeners for query middleware
setupListeners(store.dispatch);

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for using dispatch and selector
export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected,
) => TSelected = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();