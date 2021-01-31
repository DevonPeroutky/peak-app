import {PeakWikiPage} from "../../../../constants/wiki-types";
import {JournalEntry} from "./types";
import {omit} from "ramda";
import {ELEMENT_WEB_NOTE} from "../../plugins/peak-knowledge-plugin/constants";
import {useCurrentUser, useJournal} from "../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {Channel, Socket} from "phoenix";
import {useEffect} from "react";
import {AppState} from "../../../../redux";
import {store} from "../../../../redux/store";
import {JOURNAL} from "../../types";
import {updateJournalEntry} from "../../../../redux/slices/wikiPageSlice";
import {establishSocketConnectionToUsersChannel} from "../../../../utils/socketUtil";

export const useJournalSubscription = () => {
    function appendWebNoteToJournal(webNote, journal: PeakWikiPage): JournalEntry {
        const today: JournalEntry = journal.body[0] as JournalEntry
        const newSlateNode = omit(['body', 'note_type'], {...webNote, type: ELEMENT_WEB_NOTE, children: webNote.body[0].children})
        return {...today, body: [...today.body, newSlateNode]}
    }
    const user = useCurrentUser()
    const dispatch = useDispatch()
    const journal = useJournal()
    const currentUserAccountId = user.id

    let socket: Socket

    useEffect(() => {
        console.log(`SUBSCRIBING TO JOURNAL`)

        if (!socket) {
            console.log(`THERE IS NO SOCKETTTTTT`)
            establishSocketConnectionToUsersChannel(currentUserAccountId).then(channel => {
                channel.on("web_note_created", res => {
                    const appState: AppState = store.getState()
                    console.log(`RES`, res)
                    console.log(res.note)
                    const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.note, appState.peakWikiState[JOURNAL])
                    console.log(`NEW for today:`, newJournalEntryForToday)
                    dispatch(updateJournalEntry(newJournalEntryForToday))
                })
            })
        } else {
            console.log(`Already have a socket for ${currentUserAccountId}`)
        }
    }, [currentUserAccountId, journal.body]);
}
