import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";
import topics from "./topicSlice";
import user from "./userSlice";
import futureReads from "./readingListSlice"
import peakWikiState from "./wikiPageSlice"
import quickSwitcher from "./quickSwitcherSlice"
import journal from "./journalSlice"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    blacklist: ['quickSwitcher'],
    storage,
};

const rootReducer = combineReducers({ topics, user, futureReads, peakWikiState, quickSwitcher, journal });
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