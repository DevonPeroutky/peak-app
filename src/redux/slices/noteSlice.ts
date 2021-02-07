import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Node} from "slate";

export interface PeakNote {
    id: string
    title: string
    note_type: string
    icon_url: string
    body: Node[]
    url: string
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
        updateNote(state, action: PayloadAction<PeakNote>) {
            const updatedNote: PeakNote = action.payload
            return state.map(n => n.id === updatedNote.id ? updatedNote : n);
        },
        deleteNote(state, action: PayloadAction<string>) {
            const filteredBooks: PeakNote[] = state.filter(t => t.id !== action.payload)
            return filteredBooks
        }
    }
});

export const { setNotes, addNote, deleteNote, updateNote } = noteSlice.actions;
export default noteSlice.reducer;
