// create a basic redux store

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import termsSlice from "./terms";

const rootReducer = combineReducers({
    terms: termsSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
});