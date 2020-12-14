import {store} from "./store";
import {AppState, GLOBAL_APP_KEYS} from "./index";
import {UserSpecificAppState} from "./rootReducer";
import {omit} from "ramda";

export function syncCurrentStateToLocalStorage(userId: string): void {
    const currentState: AppState = store.getState()
    const userSpecificAppState = omit(GLOBAL_APP_KEYS, currentState) as UserSpecificAppState
    writeUserAppStateToLocalStorage(userId, userSpecificAppState)
}

export function writeUserAppStateToLocalStorage(userId: string, userSpecificAppState: UserSpecificAppState): void {
    localStorage.setItem(userId, JSON.stringify(userSpecificAppState));
}

export function loadUserStateFromLocalStorage(userId: string): UserSpecificAppState {
    return JSON.parse(localStorage.getItem(userId)) as UserSpecificAppState
}

