import {combineReducers, configureStore, getDefaultMiddleware, createAction} from "@reduxjs/toolkit";
import logger from "redux-logger";
import quickSwitcher from "./quickSwitcherSlice"
import electron from "./electronSlice"
import { DisplayPeaker } from "./userAccountsSlice"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {rootReducer, UserSpecificAppState} from "./rootReducer"; // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    blacklist: ['quickSwitcher', 'electron'],
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [...getDefaultMiddleware(), logger];
const store = configureStore({
    reducer: persistedReducer,
    middleware,
});
let persistor = persistStore(store);

export {
    store,
    persistor,
};
