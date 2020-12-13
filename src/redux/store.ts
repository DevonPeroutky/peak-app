import {combineReducers, configureStore, getDefaultMiddleware, createAction} from "@reduxjs/toolkit";
import logger from "redux-logger";
import topics from "./topicSlice";
import currentUser from "./userSlice";
import futureReads from "./readingListSlice"
import peakWikiState from "./wikiPageSlice"
import quickSwitcher from "./quickSwitcherSlice"
import journal from "./journalSlice"
import electron from "./electronSlice"
import tags from "./tagSlice"
import userAccounts, {DisplayPeaker} from "./userAccountsSlice"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {AppState} from "./index";
import {loadUserStateFromLocalStorage} from "./localStoreSync"; // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    blacklist: ['quickSwitcher', 'electron'],
    storage,
};

export const switch_user_accounts = createAction<DisplayPeaker>("switch_user_accounts")
const appReducer = combineReducers({ topics, currentUser, futureReads, peakWikiState, quickSwitcher, journal, electron, tags, userAccounts});
const rootReducer = (state, action) => {
    if (action.type === "switch_user_accounts") {
        const desired_user_account_id: string = action.payload.id
        console.log(`SWITCHING THE USER ACCOUNT TO: ${desired_user_account_id}`)
        return loadUserStateFromLocalStorage(desired_user_account_id) as AppState
    }
    return appReducer(state, action)
}

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
