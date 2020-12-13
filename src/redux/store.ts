import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";
import topics from "./topicSlice";
import currentUser from "./userSlice";
import futureReads from "./readingListSlice"
import peakWikiState from "./wikiPageSlice"
import quickSwitcher from "./quickSwitcherSlice"
import journal from "./journalSlice"
import electron from "./electronSlice"
import tags from "./tagSlice"
import userAccounts from "./userAccountsSlice"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    blacklist: ['quickSwitcher', 'electron'],
    storage,
};

const rootReducer = combineReducers({ topics, currentUser, futureReads, peakWikiState, quickSwitcher, journal, electron, tags, userAccounts});
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