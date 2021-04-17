import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import {ELEMENT_PEAK_BOOK, PEAK_LEARNING} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {appendNotes, deleteNote, PeakNote, STUB_BOOK_ID, updateNote, upsertNote} from "../redux/slices/noteSlice";
import {useHistory, useLocation} from "react-router-dom";
import {Node} from "slate";
import {useCallback} from "react";
import {debounce} from "lodash";
import {Peaker} from "../types";
import {endSavingPage} from "../redux/slices/activeEditor/activeEditorSlice";
import {deleteNoteRequest} from "./webNotes";
import {AxiosResponse} from "axios";
import {PaginationResponse} from "./types";
import {PeakKnowledgeKeyOption} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/types";

interface UpdateNotePayload {
    body?: Node[],
    title?: string,
    author?: string,
    tag_ids?: string[]
}
interface CreateNotePayload {
    title: string,
    author?: string,
    coverImageUrl?: string
    note_type: PeakKnowledgeKeyOption
}
interface NoteListResponse extends PaginationResponse {
    books: PeakNote[]
}

// Requests
function createBookRequest(userId: string, book: CreateNotePayload) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "book": book
    })
}
function updateNoteRequest(userId: string, noteId: string, book: UpdateNotePayload) {
    return peakAxiosClient.put(`/api/v1/users/${userId}/books/${noteId}`, {
        "book": book
    })
}
function fetchNotesRequest(userId: string, cursor?: string): Promise<AxiosResponse<NoteListResponse>> {
    const cursorQueryParam = (cursor) ? `?cursor=${cursor}` : ``
    return peakAxiosClient.get<NoteListResponse>(`/api/v1/users/${userId}/books${cursorQueryParam}`)
}
export function fetchNewestNote(user: Peaker): Promise<PeakNote> {
    return peakAxiosClient.get<{book: PeakNote}>(`/api/v1/users/${user.id}/fetch-latest-note?peak_user_id=${user.peak_user_id}`).then(res => res.data.book)
}

export function deletePeakNote(userId: string, noteId: string): Promise<string> {
    return deleteNoteRequest(userId, noteId).then(res => {
        store.dispatch(deleteNote(noteId))
        return noteId
    }).catch(err => {
        console.log(`DID NOT successfully delete the tag: ${noteId}`)
        console.log(err)
        return noteId
    })
}

// Requests + Reduxs
export function loadPeakNotes(userId: string, cursor?: string): Promise<AxiosResponse<NoteListResponse>> {
    return fetchNotesRequest(userId, cursor).then(res => {
        const books = res.data.books as PeakNote[]
        store.dispatch(appendNotes(books))
        return res
    }).catch(err => {
        console.log(`DID NOT successfully load the books for user: ${userId}`)
        console.log(err)
        return Promise.reject()
    })
}
export function createNewPeakBook(userId: string, book: CreateNotePayload): Promise<PeakNote> {
    return createBookRequest(userId, book).then(res => {
        const created_book = res.data.book as PeakNote
        store.dispatch(upsertNote(created_book))
        return created_book
    })
}
export function updatePeakNote(user: Peaker, noteId: string, note: UpdateNotePayload) {
    return updateNoteRequest(user.id, noteId, note ).then(res => {
        const updatedNote: PeakNote = res.data.book
        store.dispatch(updateNote(updatedNote))
        store.dispatch(endSavingPage())
        return updatedNote
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
    const notes = useNotes()
    const history = useHistory()
    const note: PeakNote | undefined = notes.find(n => n.id === currentNoteId)
    if (!note) {
        console.log(`That note does not seem to exist`)
        history.push(`/home/notes`)
        return undefined
    }
    return note
}
export function useSpecificNote(nodeId: string): PeakNote | undefined {
    const notes = useNotes()
    return (nodeId === STUB_BOOK_ID) ? undefined : notes.find(n => n.id === nodeId)
}
export function useDebouncePeakNoteSaver() {

    // You need useCallback otherwise it's a different function signature each render?
    // const updateNoteAndStub = (user: Peaker, note: PeakNote, newNote: UpdateNotePayload) => {
    //     return updatePeakNote(user.id, note.id, newNote)
    // }
    return useCallback(debounce(updatePeakNote, 1500), [])
}

export function usePeakBookCreator() {
    return (user: Peaker, title: string, author: string | undefined, coverImageUrl: string | undefined) => {
        return createBookRequest(user.id, {
            title: title,
            author: author,
            coverImageUrl: coverImageUrl,
            note_type: ELEMENT_PEAK_BOOK
        }).then(res => {
            const created_book = res.data.book as PeakNote
            store.dispatch(upsertNote(created_book))
            return created_book
        })
    }
}

export function usePeakNoteCreator() {
    return (user: Peaker) => {
        return createNewPeakBook(user.id, { title: "Untitled", note_type: PEAK_LEARNING })
    }
}
// ----------------------------------------------------
// DEPRECATED
// ----------------------------------------------------
// export function useDebouncePeakStubCreator() {
//     const createStub = useCreateNoteStubInJournal()
//     return useCallback(debounce(createStub, 1500), [])
// }

// function useAppendToJournal() {
//     const saver = useBulkJournalEntrySaver()
//     return (note: PeakNote, journalEntry: JournalEntry, user: Peaker, action: PeakStubAction) => {
//         const nodeId = Date.now()
//         const nodesToAppend = [
//             {
//                 id: nodeId,
//                 type: PEAK_NOTE_STUB,
//                 action: action,
//                 note_type: note.note_type,
//                 note_id:  note.id,
//                 children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH }],
//                 title: note.title,
//                 author: note.author,
//             },
//             EMPTY_PARAGRAPH_NODE()
//         ];
//
//         const cleanedJournal = journalEntry.body.filter(n => !(n.type === ELEMENT_PARAGRAPH && Node.string(n).toLowerCase() === `/${note.title.toLowerCase()}`))
//         const newBody: Node [] = cleanedJournal.concat(nodesToAppend)
//         const journalEntryToWrite: JournalEntry = {...journalEntry, body: newBody}
//
//         return saver([journalEntryToWrite], user)
//     }
// }
// function useCreateNoteStubInJournal() {
//     const appendToJournal = useAppendToJournal()
//
//     return (user: Peaker, note: PeakNote, journal: JournalEntry[], action: PeakStubAction = "added_notes") => {
//         const todayJournalEntry = getTodayEntry(journal)
//         /**
//          *  1. Find today's Journal Entry
//          *  2. If a node corresponding to the current Note does NOT exist
//          *  3. Append a stub pointing to the current note
//          */
//         const stub = todayJournalEntry.body.find(n => {
//             return (n.note_id && n.note_id === note.id && n.type === PEAK_NOTE_STUB && n.note_type === note.note_type)
//         })
//         if (!stub) {
//             console.log(`Adding a stub`)
//             return appendToJournal(note, todayJournalEntry, user, action)
//         } else {
//             console.log(`Already there Boss`)
//             return new Promise(resolve => { return "hey" });
//         }
//     }
// }