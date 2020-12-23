import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const STUB_BOOK_ID = "new-tag"
export const BOOK_TEMP_HOLDER = "create-new-book-item"
export interface PeakBook {
    id: string
    title: string
    author?: string
    inserted_at?: string
}
const emptyBookList: PeakBook[] = []

export const booksSlice = createSlice({
    name: 'books',
    initialState: emptyBookList,
    reducers: {
        setBooks(state, action: PayloadAction<PeakBook[]>) {
            return action.payload;
        },
        addBook(state, action: PayloadAction<PeakBook>) {
            return [...state, action.payload]
        },
        deleteBook(state, action: PayloadAction<string>) {
            const filteredBooks: PeakBook[] = state.filter(t => t.id !== action.payload)
            return filteredBooks
        }
    }
});

export const { setBooks, addBook, deleteBook } = booksSlice.actions;
export default booksSlice.reducer;
