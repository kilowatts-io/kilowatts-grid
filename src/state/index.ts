// create a basic redux store

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import terms from "./terms";
import api from "./api";
import live from "./live";
import { useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  api: api.reducer,
  terms: terms.reducer,
  live: live.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware) as any,
});

setupListeners(store.dispatch)


export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected,
) => TSelected = useSelector;

// export a use app dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
