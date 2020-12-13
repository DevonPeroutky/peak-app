import {store} from "./store";
import {AppState} from "./index";

export function syncCurrentStateToLocalStorage(userId: string): void {
    console.log(`Current STate`)
    const currentState: AppState = store.getState()
    localStorage.setItem(userId, JSON.stringify(currentState));
}

export function loadUserStateFromLocalStorage(userId: string): AppState {
    return JSON.parse(localStorage.getItem(userId)) as AppState
}

