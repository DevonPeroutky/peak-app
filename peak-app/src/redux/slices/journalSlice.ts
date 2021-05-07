import { createSlice } from "@reduxjs/toolkit";

export const journalSlice = createSlice({
    name: 'journal',
    initialState: false,
    reducers: {
        // addNewJournalEntry(state, action: PayloadAction<JournalEntry>) {
        //     const wtf: JournalEntry[] = state as JournalEntry[]
        //     return [action.payload, ...wtf]
        // },
        // setJournalEntries(state, action: PayloadAction<JournalEntry[]>) {
        //     return R.sort(journalOrdering, action.payload)
        // },
        // updateJournalEntry(state, action: PayloadAction<JournalEntry>) {
        //     const newEntry: JournalEntry = action.payload
        //     return R.sort(journalOrdering,[...state.filter(j => j.entry_date !== newEntry.entry_date), action.payload]);
        // },
        //
        // // TODO: UPDATE WITH NEW JOURNAL ENTRIES
        // updateJournalEntries(state, action: PayloadAction<JournalEntry[]>) {
        //     const cmp = (e1: JournalEntry, e2: JournalEntry) => e1.entry_date === e2.entry_date
        //     const updatedEntries: JournalEntry[] = action.payload
        //     const nonModifiedEntries: JournalEntry[] = differenceWith(cmp, state, updatedEntries )
        //     return R.sort(journalOrdering,[...nonModifiedEntries, ...updatedEntries]);
        // }
    }
});

export const { } = journalSlice.actions;
export default journalSlice.reducer;