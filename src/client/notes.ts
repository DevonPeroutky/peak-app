import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import {ELEMENT_PEAK_BOOK} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {upsertNote, deleteNote, PeakNote, setNotes, updateNote, STUB_BOOK_ID} from "../redux/slices/noteSlice";
import {useLocation} from "react-router-dom";
import {Node} from "slate";
import {useCallback} from "react";
import {debounce} from "lodash";
import {useBulkJournalEntrySaver, useJournal} from "../utils/hooks";
import {JournalEntry} from "../common/rich-text-editor/editors/journal/types";
import {Peaker} from "../types";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {EMPTY_PARAGRAPH_NODE} from "../common/rich-text-editor/editors/constants";
import {getTodayEntry} from "../utils/journal";
import {
    PEAK_NOTE_STUB,
    PeakStubAction,
} from "../common/rich-text-editor/plugins/peak-note-stub-plugin/types";
import {endSavingPage} from "../redux/slices/activeEditor/activeEditorSlice";

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
function updateNoteRequest(userId: string, noteId: string, book: UpdateNotePayload) {
    return peakAxiosClient.put(`/api/v1/users/${userId}/books/${noteId}`, {
        "book": book
    })
}
function deleteNoteRequest(userId: string, noteId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/books/${noteId}`)
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
    return notes.find(n => n.id === currentNoteId)
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

export function useDebouncePeakStubCreator() {
    const createStub = useCreateNoteStubInJournal()
    return useCallback(debounce(createStub, 1500), [])
}

export function usePeakNoteCreator() {
    return (user: Peaker, book: CreateNotePayload) => {
        return createNewPeakBook(user.id, book)
    }
}

function useAppendToJournal() {
    const saver = useBulkJournalEntrySaver()
    return (note: PeakNote, journalEntry: JournalEntry, user: Peaker, action: PeakStubAction) => {
        const nodeId = Date.now()
        const nodesToAppend = [
            {
                id: nodeId,
                type: PEAK_NOTE_STUB,
                action: action,
                note_type: note.note_type,
                note_id:  note.id,
                children: [{children: [{text: ''}], type: ELEMENT_PARAGRAPH }],
                title: note.title,
                author: note.author,
            },
            EMPTY_PARAGRAPH_NODE()
        ];

        const cleanedJournal = journalEntry.body.filter(n => !(n.type === ELEMENT_PARAGRAPH && Node.string(n).toLowerCase() === `/${note.title.toLowerCase()}`))
        const newBody: Node [] = cleanedJournal.concat(nodesToAppend)
        const journalEntryToWrite: JournalEntry = {...journalEntry, body: newBody}

        return saver([journalEntryToWrite], user)
    }
}
function useCreateNoteStubInJournal() {
    const appendToJournal = useAppendToJournal()

    return (user: Peaker, note: PeakNote, journal: JournalEntry[], action: PeakStubAction = "added_notes") => {
        const todayJournalEntry = getTodayEntry(journal)
        /**
         *  1. Find today's Journal Entry
         *  2. If a node corresponding to the current Note does NOT exist
         *  3. Append a stub pointing to the current note
         */
        const stub = todayJournalEntry.body.find(n => {
            return (n.note_id && n.note_id === note.id && n.type === PEAK_NOTE_STUB && n.note_type === note.note_type)
        })
        if (!stub) {
            console.log(`Adding a stub`)
            return appendToJournal(note, todayJournalEntry, user, action)
        } else {
            console.log(`Already there Boss`)
            return new Promise(resolve => { return "hey" });
        }
    }
}