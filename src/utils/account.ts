import {useHistory} from "react-router-dom";
import {DisplayPeaker} from "../redux/slices/userAccountsSlice";
import {syncCurrentStateToLocalStorage} from "../redux/localStoreSync";
import {switch_user_accounts} from "../redux/rootReducer";
import {getUserNoteChannel} from "./socketUtil";
import {store} from "../redux/store";

export const useAccountSwitcher = () => {
    const history = useHistory()

    return async (selectedAccount: DisplayPeaker, currentAccountId: string) => {
        return switchAccountsOutsideOfRouter(currentAccountId, selectedAccount, () => history.push("/"))
    }
}

// Switch the current User
// 1. Close the current Socket
// 2. De-focus current active element to avoid Slate focus bugs
// 3. Put current userState in localstorage
// 4. Load the "destined" user state into redux
// 5. Open a new socket for the "destined" user state. (Handled in <PeakLayout/>
export const switchAccountsOutsideOfRouter = async (currentAccountId: string, selectedAccount: DisplayPeaker, actuallySwitchFunc: () => void) => {
    console.log(`Switching active account to: ${selectedAccount.email}`)

    // 1. Close the current Socket
    const userChannel = getUserNoteChannel(currentAccountId)
    userChannel.leave()

    if (selectedAccount.id !== currentAccountId) {
        // @ts-ignore
        // 2. De-focus current active element to avoid Slate focus bugs
        document.activeElement.blur()

        // 3. Put current userState in localstorage
        await syncCurrentStateToLocalStorage(currentAccountId)

        // 4. Load the "destined" user state into redux
        await store.dispatch(switch_user_accounts(selectedAccount))

        // QuickSwitch or do we do a loading animation?
        // window.history.pushState({}, null, "#/home/scratchpad")
        // history.push("/")
        actuallySwitchFunc()
    }
}