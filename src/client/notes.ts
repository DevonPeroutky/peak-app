import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import { convertPeakBookToNodeSelectListItem } from "../common/rich-text-editor/utils/node-content-select/utils";
import {PeakNodeSelectListItem} from "../common/rich-text-editor/utils/node-content-select/types";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {addNote, deleteNote, PeakNote, setNotes} from "../redux/slices/noteSlice";
import {PeakWikiState} from "../constants/wiki-types";
import {useLocation} from "react-router-dom";

// Requests
function createNoteRequest(userId: string, book: {title: string}) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "book": {
            title: book.title,
            note_type: ELEMENT_PEAK_BOOK
        }
    })
}
function deleteNoteRequest(userId: string, bookId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${bookId}`)
}
function fetchNotesRequest(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/books`)
}

// Requests + Reduxs
export function loadPeakNotes(userId: string) {
    return fetchNotesRequest(userId).then(res => {
        const books = res.data.book as PeakNote[]
        store.dispatch(setNotes(books))
    }).catch(err => {
        console.log(`DID NOT successfully load the books for user: ${userId}`)
        console.log(err)
    })
}
export function deletePeakNote(userId: string, bookId: string): Promise<string> {
    return deleteNoteRequest(userId, bookId).then(res => {
        store.dispatch(deleteNote(bookId))
        return bookId
    }).catch(err => {
        console.log(`DID NOT successfully delete the tag: ${bookId}`)
        console.log(err)
        return bookId
    })
}
function createPeakNote(userId: string, title: string): Promise<PeakNote> {
    return createNoteRequest(userId, { title: title }).then(res => {
        const created_book = res.data.book as PeakNote
        store.dispatch(addNote(created_book))
        return created_book
    })
}

export function useNotes() {
    return useSelector<AppState, PeakNote[]>(state => state.notes);
}
export function useBooks() {
    return useSelector<AppState, PeakNote[]>(state => state.notes.filter(n => n.note_type === ELEMENT_PEAK_BOOK));
}
export function createNewPeakBook(userId: string, title: string): Promise<PeakNodeSelectListItem> {
    return createPeakNote(userId, title).then((created_book) => convertPeakBookToNodeSelectListItem(created_book))
}

export function useCurrentNoteId() {
    const location = useLocation();

    // TODO: HANDLE JOURNAL
    const url = location.pathname.split("/");
    const currentNoteId = url.pop()!;
    console.log(`Current Note Id`, currentNoteId)
    return currentNoteId
}
export function useCurrentNote(): PeakNote | undefined {
    const currentNoteId = useCurrentNoteId();
    return useNotes().find(n => n.id === currentNoteId)
}
