import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const STUB_TAG_ID = "new-tag"
export const TEMP_HOLDER = "create-new-tag-item"
export interface PeakTag {
    id: string
    title: string
    inserted_at?: string
    label?: string
    color?: string
}
const emptyTagList: PeakTag[] = []

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: emptyTagList,
    reducers: {
        setTags(state, action: PayloadAction<PeakTag[]>) {
            return action.payload;
        },
        addTags(state, action: PayloadAction<PeakTag[]>) {
            return [...state, ...action.payload]
        },
        deleteTag(state, action: PayloadAction<string>) {
            const filteredTags: PeakTag[] = state.filter(t => t.id !== action.payload)
            return filteredTags
        }
    }
});

export const { addTags, setTags, deleteTag } = tagsSlice.actions;
export default tagsSlice.reducer;
