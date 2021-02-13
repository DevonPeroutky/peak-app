import {PeakWikiPage} from "../../../../constants/wiki-types";
import {JournalEntry} from "./types";
import {useCurrentUser} from "../../../../utils/hooks";
import {batch, useDispatch} from "react-redux";
import {useEffect} from "react";
import {AppState} from "../../../../redux";
import {store} from "../../../../redux/store";
import {JOURNAL} from "../../types";
import {updateJournalEntry} from "../../../../redux/slices/wikiPageSlice";
import {upsertNote} from "../../../../redux/slices/noteSlice";
import {
    socket,
    subscribeToTopic
} from "../../../../utils/socketUtil";
import {JOURNAL_CHANNEL_ID} from "./constants";
import {PeakNote} from "../../../../redux/slices/noteSlice";

export const useJournalSubscription = () => {
    function appendWebNoteToJournal(webNoteNodes: Node[], journal: PeakWikiPage): JournalEntry {
        const today: JournalEntry = journal.body[0] as JournalEntry
        return {...today, body: [...today.body, ...webNoteNodes]}
    }

    const user = useCurrentUser()
    const dispatch = useDispatch()
    const currentUserAccountId = user.id

    useEffect(() => {
        console.log(`Subscribing to journal for ${currentUserAccountId}`, socket)
        if (socket) {
            const channel = subscribeToTopic(socket, JOURNAL_CHANNEL_ID(user.id))
            channel.on("web_note_created", res => {
                console.log(`Received nodes of web_note from backend broadcast`, res)
                const newlyCreatedNote: PeakNote = res.note
                const appState: AppState = store.getState()
                const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.journal_nodes, appState.peakWikiState[JOURNAL])
                batch(() => {
                    dispatch(updateJournalEntry(newJournalEntryForToday))
                    dispatch(upsertNote(newlyCreatedNote))
                })
            })
        } else {
            console.error(`NO SOCKET?!?!??!?!`)
        }
    }, [currentUserAccountId, socket]);
}
