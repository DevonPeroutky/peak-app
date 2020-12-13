import axios from "axios";
import {backend_host_address, EXISTING_PEAK_USER_ID} from "../constants/constants";
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
import {openSwitcher} from "../redux/quickSwitcherSlice";
import {useEffect} from "react";

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
    const dispatch = useDispatch()
    return async (selectedAccount: DisplayPeaker, currentAccountId: string) => {
        if (selectedAccount.id !== currentAccountId) {
            await syncCurrentStateToLocalStorage(currentAccountId)
            await dispatch(switch_user_accounts(selectedAccount))
            window.history.pushState({}, null, "/home/journal")
        }
    }
}

export const KeybindingHandlerWrapper = (props: {currentUserId: string, userAccounts: DisplayPeaker[]}) => {
    const { currentUserId, userAccounts } = props
    const dispatch = useDispatch()
    const switchAccounts = useAccountSwitcher()
    const keyBindingHandler = (event: KeyboardEvent) => {
        if (event.metaKey && event.key == 'k') {
            dispatch(openSwitcher())
        }

        // Hotkey Switcher for accounts
        if (event.metaKey && !event.shiftKey && isFinite(+event.key)) {
            const numberPressed: number = +event.key
            if (numberPressed < userAccounts.length && numberPressed >= 0 && userAccounts[numberPressed].id !== currentUserId) {
                event.preventDefault()
                const destUserAccount: DisplayPeaker = userAccounts[numberPressed]
                switchAccounts(destUserAccount, currentUserId)
            }
        }
    }

    useEffect( () => {
        window.addEventListener("keydown", keyBindingHandler);
        return () => {
            window.removeEventListener("keydown", keyBindingHandler)
        }
    }, [currentUserId])
    return null
}