import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface HelpModalState {
    isOpen: boolean
}

export const CLOSED: HelpModalState = {
    isOpen: false
};

export const helpModalSlice = createSlice({
    name: 'helpModal',
    initialState: CLOSED,
    reducers: {
        closeHelpModal() {
            return { isOpen: false }
        },
        openHelpModal() {
            return { isOpen: true }
        },
        toggleHelpModal(state) {
            return { isOpen: !state.isOpen }
        }
    }
});

export const { openHelpModal, closeHelpModal, toggleHelpModal } = helpModalSlice.actions;
export default helpModalSlice.reducer;