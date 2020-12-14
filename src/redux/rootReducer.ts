import {loadUserStateFromLocalStorage} from "./localStoreSync";
import {AppState} from "./index";
import currentUser, {Peaker, PeakTopicNode} from "./userSlice";
import {combineReducers, createAction} from "@reduxjs/toolkit";
import topics, {PeakTopic} from "./topicSlice";
import futureReads, {FutureRead} from "./readingListSlice";
import peakWikiState, {INITIAL_PAGE_STATE, PeakWikiPage, PeakWikiState} from "./wikiPageSlice";
import quickSwitcher from "./quickSwitcherSlice";
import electron from "./electronSlice";
import tags, {PeakTag} from "./tagSlice";
import userAccounts, {DisplayPeaker} from "./userAccountsSlice";
import {omit} from "ramda";

export interface UserSpecificAppState {
    currentUser: Peaker
    futureReads: FutureRead[]
    tags: PeakTag[]
    topics: PeakTopic[]
    peakWikiState: PeakWikiState
}

export const switch_user_accounts = createAction<DisplayPeaker>("switch_user_accounts")
export const load_active_user = createAction<UserSpecificAppState>("load_active_user")

const appReducer = combineReducers({ topics, currentUser, futureReads, peakWikiState, quickSwitcher, electron, tags, userAccounts});
export const rootReducer = (state, action) => {
    if (action.type === "switch_user_accounts") {
        const desired_user_account_id: string = action.payload.id
        const desiredUserAccountState: UserSpecificAppState = loadUserStateFromLocalStorage(desired_user_account_id) as UserSpecificAppState
        return {...state, ...desiredUserAccountState}
    }
    if (action.type === "load_active_user") {
        const userAccountAppState: UserSpecificAppState = action.payload
        return {...state, ...userAccountAppState}

    }
    return appReducer(state, action)
}
