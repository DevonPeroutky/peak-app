import axios from "axios";
import {backend_host_address} from "../constants/constants";
import {setTopics} from "../redux/topicSlice";
import {setFutureReads} from "../redux/readingListSlice";
import {addPages} from "../redux/wikiPageSlice";
import {setUser} from "../redux/userSlice";
import {loadAllUserAccounts, loadPeakTags} from "./requests";
import {useDispatch} from "react-redux";
import {useCurrentUser} from "./hooks";
import {DisplayPeaker} from "../redux/userAccountsSlice";
import {syncCurrentStateToLocalStorage} from "../redux/localStoreSync";
import {switch_user_accounts} from "../redux/store";
import { useHistory } from "react-router-dom";

export function useLoaderOfAllThings(): () => (() => Promise<void>)[] {
    const dispatch = useDispatch()
    const user = useCurrentUser()

    const fetchAllTopics = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/topics`)
            .then(res => {
                const topics = res.data.topics;
                dispatch(setTopics(topics));
            }).catch(() => {
                console.log("ERROR")
            });
    };
    const fetchEntireReadingList = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/future-reads`)
            .then(res => {
                const readingList = res.data.data
                dispatch(setFutureReads(readingList))
            });
    };
    const fetchPages = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}/pages`)
            .then(res => {
                const wikiPages = res.data.pages;
                dispatch(addPages(wikiPages))
            });
    };
    const fetchHierarchy = () => {
        return axios.get(`${backend_host_address}/api/v1/users/${user.id}`)
            .then(res => {
                const user = res.data.data;
                dispatch(setUser(user))
            });
    };
    const fetchTags = () => {
        return loadPeakTags(user.id)
    }
    const fetchAllUserAccounts = () => {
        return loadAllUserAccounts(user.id, user.peak_user_id)
    }

    return () => [fetchAllTopics, fetchEntireReadingList, fetchPages, fetchHierarchy, fetchTags, fetchAllUserAccounts]
}

export const useAccountSwitcher = () => {
    const currentUser = useCurrentUser()
    const dispatch = useDispatch()
    const history = useHistory()
    return (selectedAccount: DisplayPeaker) => {
        if (selectedAccount.id !== currentUser.id) {
            syncCurrentStateToLocalStorage(currentUser.id)
            dispatch(switch_user_accounts(selectedAccount))
            history.push("/home/journal")
        }
    }
}