import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface PeakNote {
    id: string
    title: string
    note_type: string
    author?: string
    inserted_at?: string
}
const emptyBookList: PeakNote[] = []

export const noteSlice = createSlice({
    name: 'notes',
    initialState: emptyBookList,
    reducers: {
        setNotes(state, action: PayloadAction<PeakNote[]>) {
            return action.payload;
        },
        addNote(state, action: PayloadAction<PeakNote>) {
            return [...state, action.payload]
        },
        deleteNote(state, action: PayloadAction<string>) {
            const filteredBooks: PeakNote[] = state.filter(t => t.id !== action.payload)
            return filteredBooks
        }
    }
});

export const { setNotes, addNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
