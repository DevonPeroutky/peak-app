import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ElectronState {
    isFullscreen: boolean,
    journalHotKeyPressed: boolean,
}

export const INITIAL_STATE: ElectronState = {
    isFullscreen: false,
    journalHotKeyPressed: false,
};

export const electronSlice = createSlice({
    name: 'quickSwitcher',
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
        }
    }
});

export const { leaveFullscreen, enterFullscreen, journalHotkeyPressed, resetJournalHotkeyPressed } = electronSlice.actions;
export default electronSlice.reducer;