import {PeakWikiPage} from "../../../../constants/wiki-types";
import {JournalEntry} from "./types";
import {useCurrentUser} from "../../../../utils/hooks";
import {batch, useDispatch} from "react-redux";
import {useEffect} from "react";
import {deleteNote, upsertNote} from "../../../../redux/slices/noteSlice";
import {
    socket,
    subscribeToTopic
} from "../../../../utils/socketUtil";
import {JOURNAL_CHANNEL_ID} from "./constants";
import {PeakNote} from "../../../../redux/slices/noteSlice";
import {PeakTag} from "../../../../types";
import { addTags } from "src/redux/slices/tags/tagSlice";
import {store} from "../../../../redux/store";

// DEPRECATED
export const useWebNoteSubscription = () => {
    function appendWebNoteToJournal(webNoteNodes: Node[], journal: PeakWikiPage, note_id: string): JournalEntry {
        const today: JournalEntry = journal.body[0] as JournalEntry
        return {...today, body: [...today.body, ...webNoteNodes] }
    }

    const user = useCurrentUser()
    const dispatch = useDispatch()
    const currentUserAccountId = user.id
    console.log(`CURRENT USER: `, user)

    useEffect(() => {
        console.log(`Subscribing to journal for ${currentUserAccountId}`, socket)
        if (socket) {
            const channel = subscribeToTopic(socket, JOURNAL_CHANNEL_ID(user.id))

            channel.on("delete_bookmark", res => {
                const noteIdToDelete: string = res.noteId
                dispatch(deleteNote(noteIdToDelete))
            })

            channel.on("test", res => {
                console.log(`WE RECEIVED A TESTIE `, res)
            })

            channel.on("web_note_created", res => {
                console.log(`Received nodes of web_note from backend broadcast`, res)
                console.log(`Subscribing Current Active user (${currentUserAccountId}): `, user)

                const newlyCreatedNote: PeakNote = res.note
                const tags: PeakTag[] = res.tags
                // const appState: AppState = store.getState()
                // const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.journal_nodes, appState.peakWikiState[JOURNAL], newlyCreatedNote.id)
                batch(() => {
                    // dispatch(updateJournalEntry(newJournalEntryForToday))
                    dispatch(upsertNote(newlyCreatedNote))
                    dispatch(addTags(tags))
                })
            })

            channel.onClose(res => {
                console.log(`CHANNEL IS BEING CLOSED ${currentUserAccountId}!!!!`, res)
            })
        } else {
            console.error(`NO SOCKET?!?!??!?!`)
        }
    }, [currentUserAccountId, socket]);
}

export const setupUserSocketChannels = (currentUserAccountId: string) => {
    if (socket) {
        console.log(`Subscribing to journal for ${currentUserAccountId}`, socket)
        const channel = subscribeToTopic(socket, JOURNAL_CHANNEL_ID(currentUserAccountId))

        channel.on("delete_bookmark", res => {
            const noteIdToDelete: string = res.noteId
            store.dispatch(deleteNote(noteIdToDelete))
        })

        channel.on("test", res => {
            console.log(`WE RECEIVED A TESTIE `, res)
        })

        channel.on("web_note_created", res => {
            console.log(`Received nodes of web_note from backend broadcast`, res)
            console.log(`Subscribing Current Active user (${currentUserAccountId}) `)

            const newlyCreatedNote: PeakNote = res.note
            const tags: PeakTag[] = res.tags
            // const appState: AppState = store.getState()
            // const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.journal_nodes, appState.peakWikiState[JOURNAL], newlyCreatedNote.id)
            batch(() => {
                // dispatch(updateJournalEntry(newJournalEntryForToday))
                store.dispatch(upsertNote(newlyCreatedNote))
                store.dispatch(addTags(tags))
            })
        })

        channel.onClose(res => {
            console.log(`${currentUserAccountId} CHANNEL IS BEING CLOSED!!!!`, res)
        })
    } else {
        console.error(`NO SOCKET?!?!??!?!`)
    }
}