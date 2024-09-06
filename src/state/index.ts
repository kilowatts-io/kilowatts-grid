// create a basic redux store

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import termsSlice from "./terms";
import api from "./api";
import liveSlice from "./live";
import { useDispatch } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  api: api.reducer,
  terms: termsSlice.reducer,
  live: liveSlice.reducer,
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

// export a use app dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
