import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ElectronState {
    isFullscreen: boolean
}

export const INITIAL_STATE: ElectronState = {
    isFullscreen: false
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
        }
    }
});

export const { leaveFullscreen, enterFullscreen } = electronSlice.actions;
export default electronSlice.reducer;