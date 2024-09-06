// create a basic redux store

import { configureStore, combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({});

export const store = configureStore({
    reducer: rootReducer,
});