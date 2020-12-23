import {loadUserStateFromLocalStorage} from "./localStoreSync";
import currentUser, {Peaker, PeakTopicNode} from "./slices/userSlice";
import {combineReducers, createAction} from "@reduxjs/toolkit";
import topics, {PeakTopic} from "./slices/topicSlice";
import futureReads, {FutureRead} from "./slices/readingListSlice";
import peakWikiState, {INITIAL_PAGE_STATE, PeakWikiPage, PeakWikiState} from "./slices/wikiPageSlice";
import quickSwitcher from "./slices/quickSwitcherSlice";
import electron from "./slices/electronSlice";
import tags, {PeakTag} from "./slices/tagSlice";
import books, {PeakBook} from "./slices/booksSlice";
import userAccounts, {DisplayPeaker} from "./slices/userAccountsSlice";

export interface UserSpecificAppState {
    currentUser: Peaker
    futureReads: FutureRead[]
    tags: PeakTag[]
    topics: PeakTopic[]
    peakWikiState: PeakWikiState
    books: PeakBook[]
}

export const switch_user_accounts = createAction<DisplayPeaker>("switch_user_accounts")
export const load_active_user = createAction<UserSpecificAppState>("load_active_user")

const appReducer = combineReducers({ topics, currentUser, futureReads, peakWikiState, quickSwitcher, electron, tags, userAccounts, books});
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
