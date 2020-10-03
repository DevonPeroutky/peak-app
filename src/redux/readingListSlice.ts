import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqWith } from "ramda"

export interface FutureRead {
    id: string
    userId: string
    topicId?: string
    title: string
    url: string
    dateAdded: string
    dateRead?: string
}
const emptyReadingList: FutureRead[] = [];

export const readingListSlice = createSlice({
    name: 'future-reads',
    initialState: emptyReadingList,
    reducers: {
        addFutureRead(state, action: PayloadAction<FutureRead>) {
            return [...state, action.payload]
        },
        setFutureReads(state, action: PayloadAction<FutureRead[]>) {
            return action.payload
        },
        addFutureReads(state, action: PayloadAction<FutureRead[]>) {
            return uniqWith((x: FutureRead, y: FutureRead) => x.id === y.id, [...state, ...action.payload])
        },
        deleteFutureRead(state, action: PayloadAction<string>) {
            return state.filter(futureRead => futureRead.id !== action.payload)
        }
    }
});

export const { addFutureRead, setFutureReads, addFutureReads, deleteFutureRead } = readingListSlice.actions;
export default readingListSlice.reducer;