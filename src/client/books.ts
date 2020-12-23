import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {addBook, deleteBook, PeakBook, setBooks} from "../redux/slices/booksSlice";
import {store} from "../redux/store";
import {insertCustomBlockElement} from "../common/rich-text-editor/utils/base-utils";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-book-plugin/defaults";
import {Editor} from "slate";
import {PeakNodeSelectListItem} from "../common/rich-text-editor/utils/node-content-select/types";
import {ReadOutlined} from "@ant-design/icons/lib";
import {
    convertPeakBookToNodeSelectListItem,
    insertBookElementCallback
} from "../common/rich-text-editor/utils/node-content-select/utils";

// Requests
function createBookRequest(userId: string, book: {title: string}) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "book": {
            title: book.title,
        }
    })
}
function deleteBookRequest(userId: string, bookId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${bookId}`)
}
function fetchBooksRequest(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/books`)
}

// Requests + Reduxs
export function loadPeakTags(userId: string) {
    return fetchBooksRequest(userId).then(res => {
        const books = res.data.tags as PeakBook[]
        store.dispatch(setBooks(books))
    }).catch(err => {
        console.log(`DID NOT successfully load the books for user: ${userId}`)
        console.log(err)
    })
}
export function deletePeakBook(userId: string, bookId: string): Promise<string> {
    return deleteBookRequest(userId, bookId).then(res => {
        store.dispatch(deleteBook(bookId))
        return bookId
    }).catch(err => {
        console.log(`DID NOT successfully delete the tag: ${bookId}`)
        console.log(err)
        return bookId
    })
}
function createPeakBook(userId: string, title: string): Promise<PeakBook> {
    return createBookRequest(userId, { title: title }).then(res => {
        const created_book = res.data.book as PeakBook
        store.dispatch(addBook(created_book))
        return created_book
    })
}
export function useBooks() {
    return useSelector<AppState, PeakBook[]>(state => state.books);
}

export function createNewPeakBook(userId: string, title: string): Promise<PeakNodeSelectListItem> {
    return createPeakBook(userId, title).then((created_book) => convertPeakBookToNodeSelectListItem(created_book))
}
