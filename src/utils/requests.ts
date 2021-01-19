import {PeakHierarchy} from "../redux/slices/user/types";
import {Node} from "slate";
import {store} from "../redux/store";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {DisplayPeaker, setUserAccounts} from "../redux/slices/userAccountsSlice";
import {UserSpecificAppState} from "../redux/rootReducer";
import {clone, omit} from "ramda";
import peakAxiosClient from "../client/axiosConfig";
import {INITIAL_WIKI_STATE} from "../redux/slices/wikiPageSlice";
import {INITIAL_PAGE_STATE} from "../constants/editor";
import {PeakWikiPage, PeakWikiState} from "../constants/wiki-types";

// Page
interface PeakPageParams {
    topicId?: string
    title?: string
    body?: Node[]
}
export function updatePage(userId: string, pageId: string, updatedPageParams: PeakPageParams, hierarchy: PeakHierarchy) {
    return peakAxiosClient.put(`/api/v1/users/${userId}/pages/${pageId}`, {
        "page": updatedPageParams,
        "hierarchy": hierarchy
    })
}

// User Accounts
function fetchAllUserAccounts(userId: string, peakUserId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/list-all-accounts?peak_user_id=${peakUserId}`)
}
export function loadAllUserAccounts(userId: string, peakUserId: string) {
    return fetchAllUserAccounts(userId, peakUserId).then(res => {
        console.log(`FETCHED ALL THE USER ACCOUNTS`)
        console.log(res)
        console.log(res.data)
        const userAccounts: DisplayPeaker[] = res.data.users as DisplayPeaker[]
        store.dispatch(setUserAccounts(userAccounts))
        return userAccounts
    })
}
export function useUserAccounts() {
    return useSelector<AppState, DisplayPeaker[]>(state => state.userAccounts);
}


// Load UserSpecificAppState
export function fetchUserSpecificAppState(userId: string): Promise<UserSpecificAppState> {
    return peakAxiosClient.get(`/api/v1/users/${userId}/load-entire-state`).then(res => {
        const fatUser  = res.data
        const emptyWikiState: PeakWikiState = clone(INITIAL_WIKI_STATE)

        // 1. Merge with existing: electron, userAccounts, quickSwitch
        // 2. Convert list of pages to peakWikiState
        const pages: PeakWikiPage[] = fatUser.pages
        const peakWiki: PeakWikiState = pages.reduce(function(map, obj) {
            map[obj.id] = {...INITIAL_PAGE_STATE, ...obj};
            return map;
        }, emptyWikiState);

        return omit(['pages'], {...fatUser, peakWikiState: peakWiki}) as UserSpecificAppState
    })
}
