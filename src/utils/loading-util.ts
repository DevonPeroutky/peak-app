import {fetchUserSpecificAppState, loadAllUserAccounts, loadPeakTags} from "./requests";
import {useDispatch} from "react-redux";
import {DisplayPeaker} from "../redux/slices/userAccountsSlice";
import {syncCurrentStateToLocalStorage, writeUserAppStateToLocalStorage} from "../redux/localStoreSync";
import {store} from "../redux/store";
import {openSwitcher} from "../redux/slices/quickSwitcherSlice";
import {useEffect} from "react";
import {load_active_user, switch_user_accounts} from "../redux/rootReducer";

export function loadEntireWorldForAllAccounts(ogUserId: string, peakUserId: string): Promise<void> {
    return loadAllUserAccounts(ogUserId, peakUserId).then(res => {
        const accounts: DisplayPeaker[] = res as DisplayPeaker[]
        const activeAccount: DisplayPeaker = accounts.find(acc => acc.id === ogUserId)
        const backgroundAccounts: DisplayPeaker[] = accounts.filter(acc => acc.id !== ogUserId)

        // For Background Account --> Load, sync to localStorage in background
        backgroundAccounts.forEach((acc) => {
            console.log(`Loading entire world for:`)
            console.log(acc)
            fetchUserSpecificAppState(acc.id).then(userSpecificAppState => {
                writeUserAppStateToLocalStorage(userSpecificAppState.currentUser.id, userSpecificAppState)
            })
        })
        console.log('ACCOUNT SITUATION')
        console.log(accounts)
        console.log(activeAccount)
        console.log(backgroundAccounts)

        // For Active Account --> Return a Promise that: Load, sync to localStorage, save to Redux
        return fetchUserSpecificAppState(activeAccount.id).then(userSpecificAppState => {
            console.log(`Loading the BIG DAWGGGGGG: `)
            console.log(userSpecificAppState)
            store.dispatch(load_active_user(userSpecificAppState))
            writeUserAppStateToLocalStorage(userSpecificAppState.currentUser.id, userSpecificAppState)
        })
    })
}

export const useAccountSwitcher = () => {
    const dispatch = useDispatch()
    return async (selectedAccount: DisplayPeaker, currentAccountId: string) => {
        if (selectedAccount.id !== currentAccountId) {
            // @ts-ignore
            document.activeElement.blur()
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
            event.preventDefault()
            const numberPressed: number = +event.key
            if (numberPressed < userAccounts.length && numberPressed >= 0 && userAccounts[numberPressed].id !== currentUserId) {
                const destUserAccount: DisplayPeaker = userAccounts[numberPressed]
                console.log(`DESTINATION ACCOUNT`)
                console.log(destUserAccount)
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

