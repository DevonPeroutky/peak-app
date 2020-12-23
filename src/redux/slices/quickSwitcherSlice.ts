import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface QuickSwitcherState {
   isOpen: boolean
}

export const CLOSED: QuickSwitcherState = {
    isOpen: false
};

export const quickSwitcherSlice = createSlice({
    name: 'quickSwitcher',
    initialState: CLOSED,
    reducers: {
        closeSwitcher(state) {
            return { isOpen: false }
        },
        openSwitcher(state) {
            return { isOpen: true }
        }
    }
});

export const { openSwitcher, closeSwitcher } = quickSwitcherSlice.actions;
export default quickSwitcherSlice.reducer;