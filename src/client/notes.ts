import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import { convertPeakBookToNodeSelectListItem } from "../common/rich-text-editor/utils/node-content-select/utils";
import {PeakNodeSelectListItem} from "../common/rich-text-editor/utils/node-content-select/types";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {addNote, deleteNote, PeakNote, setNotes, updateNote} from "../redux/slices/noteSlice";
import {PeakWikiState} from "../constants/wiki-types";
import {useLocation} from "react-router-dom";
import {Node} from "slate";
import {useCallback} from "react";
import {debounce} from "lodash";

// Requests
function createNoteRequest(userId: string, book: {title: string, iconUrl: string, author: string}) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "book": {
            title: book.title,
            iconUrl: book.iconUrl,
            author: book.author,
            note_type: ELEMENT_PEAK_BOOK
        }
    })
}
function updateNoteRequest(userId: string, bookId: string, book: { body?: Node[], title?: string, author?: string }) {
    return peakAxiosClient.put(`/api/v1/users/${userId}/books/${bookId}`, {
        "book": book
    })
}
function deleteNoteRequest(userId: string, bookId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/books/${bookId}`)
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
export function createNewPeakBook(userId: string, data: PeakNodeSelectListItem): Promise<PeakNodeSelectListItem> {
    function createPeakNote(userId: string, title: string, iconUrl: string, author: string): Promise<PeakNote> {
        return createNoteRequest(userId, {
            title: title,
            iconUrl: iconUrl,
            author: author
        }).then(res => {
            const created_book = res.data.book as PeakNote
            store.dispatch(addNote(created_book))
            return created_book
        })
    }
    return createPeakNote(userId, data.title, data.iconUrl, data.description).then((created_book) => convertPeakBookToNodeSelectListItem(created_book))
}
function updatePeakNote(userId: string, bookId: string, note: { body?: Node[], title?: string, author?: string}) {
    updateNoteRequest(userId, bookId, note ).then(res => {
        const updatedNote: PeakNote = res.data.book
        store.dispatch(updateNote(updatedNote))
    })
}

// Hooks
export function useNotes() {
    return useSelector<AppState, PeakNote[]>(state => state.notes);
}
export function useBooks() {
    return useSelector<AppState, PeakNote[]>(state => state.notes.filter(n => n.note_type === ELEMENT_PEAK_BOOK));
}
export function useCurrentNoteId() {
    const location = useLocation();

    // TODO: HANDLE JOURNAL
    const url = location.pathname.split("/");
    const currentNoteId = url.pop()!;
    return currentNoteId
}
export function useCurrentNote(): PeakNote | undefined {
    const currentNoteId = useCurrentNoteId();
    return useNotes().find(n => n.id === currentNoteId)
}
export function useDebouncePeakNoteSaver() {

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(updatePeakNote, 1500), [])
}

