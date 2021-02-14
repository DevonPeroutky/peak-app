import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import { convertPeakBookToNodeSelectListItem } from "../common/rich-text-editor/utils/node-content-select/utils";
import {PeakNodeSelectListItem} from "../common/rich-text-editor/utils/node-content-select/types";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {upsertNote, deleteNote, PeakNote, setNotes, updateNote, STUB_BOOK_ID} from "../redux/slices/noteSlice";
import {useLocation} from "react-router-dom";
import {Node} from "slate";
import {useCallback} from "react";
import {debounce} from "lodash";

interface UpdateNotePayload {
    body?: Node[],
    title?: string,
    author?: string,
    tag_ids?: string[]
}

interface CreateNotePayload {
    title: string,
    author: string,
    iconUrl: string
}

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
function updateNoteRequest(userId: string, bookId: string, book: UpdateNotePayload) {
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
export function createNewPeakBook(userId: string, book: CreateNotePayload): Promise<PeakNote> {
    function createPeakNote(userId: string, book: CreateNotePayload): Promise<PeakNote> {
        return createNoteRequest(userId, book).then(res => {
            const created_book = res.data.book as PeakNote
            store.dispatch(upsertNote(created_book))
            return created_book
        })
    }
    return createPeakNote(userId, book)
}
export function updatePeakNote(userId: string, bookId: string, note: UpdateNotePayload) {
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
export function useSpecificNote(nodeId: string): PeakNote | undefined {
    const notes = useNotes()
    return (nodeId === STUB_BOOK_ID) ? undefined : notes.find(n => n.id === nodeId)
}
export function useDebouncePeakNoteSaver() {

    // You need useCallback otherwise it's a different function signature each render?
    return useCallback(debounce(updatePeakNote, 1500), [])
}

