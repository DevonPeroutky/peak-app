import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PeakEditorState, PeakHyperlinkState} from "../../../constants/wiki-types";
import {INITIAL_EDITING_STATE, INITIAL_LINK_STATE, INITIAL_PAGE_STATE} from "../../../constants/editor";
import {useSelector} from "react-redux";
import {AppState} from "../../index";

export const activeEditorSlice = createSlice({
    name: 'activeEditorState',
    initialState: INITIAL_EDITING_STATE,
    reducers: {
        beginSavingPage(state) {
            return { ...state, isSaving: true }
        },
        endSavingPage(state) {
            return { ...state, isSaving: false }
        },
        openEmptyLinkMenu(state) {
            return { ...state, showLinkMenu: true }
        },
        setEditing(state, action: PayloadAction<{ isEditing: boolean }>) {
            return {...INITIAL_EDITING_STATE, isEditing: action.payload.isEditing }
        },
        closeLinkMenu(state) {
            return {...state, showLinkMenu: false, currentLinkState: INITIAL_LINK_STATE }
        },
        openEditLinkMenu(state, action: PayloadAction<{hyperlinkState: PeakHyperlinkState}>) {
            return {...state, showLinkMenu: true, currentLinkState: action.payload.hyperlinkState }
        },
        setEditorFocusToNode(state, action: PayloadAction<{nodeId: number, focused: boolean }>) {
            const { nodeId, focused } = action.payload
            const newCodeEditorFocusState = { [nodeId]: focused }
            return {...state, focusMap: newCodeEditorFocusState }
        },
    }
})

export const { beginSavingPage, openEditLinkMenu, openEmptyLinkMenu, endSavingPage, setEditorFocusToNode, setEditing, closeLinkMenu } = activeEditorSlice.actions;
export default activeEditorSlice.reducer;

export const useActiveEditorState = () => {
    return useSelector<AppState, PeakEditorState>(state => state.activeEditorState);
}
