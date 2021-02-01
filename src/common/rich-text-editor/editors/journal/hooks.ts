import {PeakWikiPage} from "../../../../constants/wiki-types";
import {JournalEntry} from "./types";
import {omit} from "ramda";
import {ELEMENT_WEB_NOTE} from "../../plugins/peak-knowledge-plugin/constants";
import {useCurrentUser} from "../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {AppState} from "../../../../redux";
import {store} from "../../../../redux/store";
import {JOURNAL} from "../../types";
import {updateJournalEntry} from "../../../../redux/slices/wikiPageSlice";
import {
    socket,
    subscribeToTopic
} from "../../../../utils/socketUtil";
import {JOURNAL_CHANNEL_ID} from "./constants";

export const useJournalSubscription = () => {
    function appendWebNoteToJournal(webNote, journal: PeakWikiPage): JournalEntry {
        const today: JournalEntry = journal.body[0] as JournalEntry
        const newSlateNode = omit(['body', 'note_type'], {...webNote, type: ELEMENT_WEB_NOTE, children: webNote.body[0].children})
        return {...today, body: [...today.body, newSlateNode]}
    }

    const user = useCurrentUser()
    const dispatch = useDispatch()
    const currentUserAccountId = user.id

    useEffect(() => {
        console.log(`Subscribing to journal for ${currentUserAccountId}`, socket)
        if (socket) {
            const channel = subscribeToTopic(socket, JOURNAL_CHANNEL_ID(user.id))
            channel.on("web_note_created", res => {
                const appState: AppState = store.getState()
                console.log(`RES`, res)
                console.log(res.note)
                const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.note, appState.peakWikiState[JOURNAL])
                console.log(`NEW for today:`, newJournalEntryForToday)
                dispatch(updateJournalEntry(newJournalEntryForToday))
            })
        } else {
            console.error(`NO SOCKET?!?!??!?!`)
        }
    }, [currentUserAccountId, socket]);
}
