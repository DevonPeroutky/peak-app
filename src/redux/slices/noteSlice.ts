import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Node} from "slate";
import {PeakKnowledgeKeyOption} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/types";
import {PeakTopic} from "./topicSlice";
import {sort} from "ramda";

export const STUB_BOOK_ID = "new-book"

export interface PeakNote {
    id: string
    title: string
    note_type: PeakKnowledgeKeyOption,
    icon_url: string
    tag_ids: string[]
    body: Node[]
    url: string
    author?: string
    inserted_at?: string
    updated_at?: string
}
const emptyBookList: PeakNote[] = []

const noteOrderingByDate = (a: PeakNote, b: PeakNote) => {
    return (a.inserted_at <= b.inserted_at) ? -1 : 1
};

export const noteSlice = createSlice({
    name: 'notes',
    initialState: emptyBookList,
    reducers: {
        setNotes(state, action: PayloadAction<PeakNote[]>) {
            return sort(noteOrderingByDate, action.payload);
        },
        upsertNote(state, action: PayloadAction<PeakNote>) {
            const noteToUpsert: PeakNote = action.payload
            const newNotes: PeakNote[] = [action.payload, ...state.filter(n => n.id !== noteToUpsert.id)]
            return newNotes
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

export const { setNotes, upsertNote, deleteNote, updateNote } = noteSlice.actions;
export default noteSlice.reducer;
