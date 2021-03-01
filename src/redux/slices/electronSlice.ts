import {createSlice} from "@reduxjs/toolkit";

export interface ElectronState {
    isOnline: boolean,
    isFullscreen: boolean,
    journalHotKeyPressed: boolean,
}

export const INITIAL_STATE: ElectronState = {
    isOnline: true,
    isFullscreen: false,
    journalHotKeyPressed: false,
};

export const electronSlice = createSlice({
    name: 'electron',
    initialState: INITIAL_STATE,
    reducers: {
        leaveFullscreen(state) {
            return { ...state, isFullscreen: false }
        },
        enterFullscreen(state) {
            return { ...state, isFullscreen: true }
        },
        journalHotkeyPressed(state) {
            return { ...state, journalHotKeyPressed: true }
        },
        resetJournalHotkeyPressed(state) {
            return { ...state, journalHotKeyPressed: false }
        },
        setOnline(state) {
            return { ...state, isOnline: true }
        },
        setOffline(state) {
            return { ...state, isOnline: false }
        }
    }
});

export const { leaveFullscreen, enterFullscreen, journalHotkeyPressed, resetJournalHotkeyPressed, setOffline, setOnline } = electronSlice.actions;
export default electronSlice.reducer;