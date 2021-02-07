import {loadUserStateFromLocalStorage} from "./localStoreSync";
import currentUser from "./slices/user/userSlice";
import {combineReducers, createAction} from "@reduxjs/toolkit";
import topics, {PeakTopic} from "./slices/topicSlice";
import futureReads, {FutureRead} from "./slices/readingListSlice";
import peakWikiState from "./slices/wikiPageSlice";
import quickSwitcher, {QuickSwitcherState} from "./slices/quickSwitcherSlice";
import electron from "./slices/electronSlice";
import tags from "./slices/tags/tagSlice";
import notes, {PeakNote} from "./slices/noteSlice";
import userAccounts, {DisplayPeaker} from "./slices/userAccountsSlice";
import activeEditorState from "./slices/activeEditor/activeEditorSlice"
import {PeakWikiState} from "../constants/wiki-types";
import {Peaker, PeakTag} from "../types";

export interface UserSpecificAppState {
    currentUser: Peaker
    futureReads: FutureRead[]
    tags: PeakTag[]
    topics: PeakTopic[]
    peakWikiState: PeakWikiState
    notes: PeakNote[]
}

export const switch_user_accounts = createAction<DisplayPeaker>("switch_user_accounts")
export const load_active_user = createAction<UserSpecificAppState>("load_active_user")

const appReducer = combineReducers({ topics, currentUser, futureReads, peakWikiState, quickSwitcher, electron, tags, userAccounts, notes, activeEditorState});
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
