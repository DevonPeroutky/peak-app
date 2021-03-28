import {fetchUserSpecificAppState, loadAllUserAccounts} from "./requests";
import {useDispatch} from "react-redux";
import {DisplayPeaker} from "../redux/slices/userAccountsSlice";
import {syncCurrentStateToLocalStorage, writeUserAppStateToLocalStorage} from "../redux/localStoreSync";
import {store} from "../redux/store";
import {openSwitcher} from "../redux/slices/quickSwitcherSlice";
import {useEffect} from "react";
import {load_active_user, switch_user_accounts} from "../redux/rootReducer";
import { useHistory } from "react-router-dom";
import {useUserChannel, useSocket} from "./socketUtil";
import {Channel, Socket} from "phoenix";
import {useCurrentUser} from "./hooks";
import {Peaker} from "../types";

export function loadEntireWorldForAllAccounts(ogUserId: string, peakUserId: string): Promise<void> {
    return loadAllUserAccounts(ogUserId, peakUserId).then(res => {
        const accounts: DisplayPeaker[] = res as DisplayPeaker[]
        const activeAccount: DisplayPeaker = accounts.find(acc => acc.id === ogUserId)
        const backgroundAccounts: DisplayPeaker[] = accounts.filter(acc => acc.id !== ogUserId)

        // For Background Account --> Load, sync to localStorage in background
        backgroundAccounts.forEach((acc) => {
            fetchUserSpecificAppState(acc.id).then(userSpecificAppState => {
                writeUserAppStateToLocalStorage(userSpecificAppState.currentUser.id, userSpecificAppState)
            })
        })

        // For Active Account --> Return a Promise that: Load, sync to localStorage, save to Redux
        return fetchUserSpecificAppState(activeAccount.id).then(userSpecificAppState => {
            store.dispatch(load_active_user(userSpecificAppState))
            writeUserAppStateToLocalStorage(userSpecificAppState.currentUser.id, userSpecificAppState)
        })
    }).catch(err => {
        console.log(`DID NOT successfully load the accounts for user: ${ogUserId}`)
        console.log(err)
    })
}

export const useAccountSwitcher = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const socket: Socket = useSocket()
    const getUserChannel = useUserChannel()

    // TODO: Close current socket connection!
    // Switch the current User
    // 1. Put current userState in localstorage
    // 2. Load the "destined" user state into redux
    // 3. Close the current Socket
    // 4. Open a new socket for the "destined" user state.
    return async (selectedAccount: DisplayPeaker, currentAccountId: string) => {
        const userChannel = getUserChannel(currentAccountId)

        console.log(`CURRENT SOCKET for ${currentAccountId}: `, socket )
        console.log(`Leaving the socket!`)
        userChannel.leave()
        console.log(`Socket `, socket)

        if (selectedAccount.id !== currentAccountId) {
            // @ts-ignore
            document.activeElement.blur()
            await syncCurrentStateToLocalStorage(currentAccountId)
            await dispatch(switch_user_accounts(selectedAccount))
            window.history.pushState({}, null, "#/home/scratchpad")
            // history.push("/")
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

