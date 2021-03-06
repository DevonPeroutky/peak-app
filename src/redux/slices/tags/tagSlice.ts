import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PeakTag} from "../../../types";
import {uniqBy} from "ramda";

const emptyTagList: PeakTag[] = []

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: emptyTagList,
    reducers: {
        setTags(state, action: PayloadAction<PeakTag[]>) {
            return action.payload;
        },
        addTags(state, action: PayloadAction<PeakTag[]>) {
            return uniqBy(t => t.id, [...state, ...action.payload])
        },
        deleteTag(state, action: PayloadAction<string>) {
            const filteredTags: PeakTag[] = state.filter(t => t.id !== action.payload)
            return filteredTags
        }
    }
});

export const { addTags, setTags, deleteTag } = tagsSlice.actions;
export default tagsSlice.reducer;
