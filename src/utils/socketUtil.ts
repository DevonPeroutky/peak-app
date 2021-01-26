import {Channel, Socket} from 'phoenix';
import {useCurrentUser, useJournal} from "./hooks";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {store} from "../redux/store";
import {AppState} from "../redux";
import {PeakWikiPage} from "../constants/wiki-types";
import {JOURNAL} from "../common/rich-text-editor/types";
import {JournalEntry} from "../common/rich-text-editor/editors/journal/types";
import {ELEMENT_WEB_NOTE} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {omit} from "ramda";
import { updateJournalEntry } from '../redux/slices/wikiPageSlice';

export function establishSocketConnectionToUsersChannel(userId: string): Channel {
    console.log(`!!!!!!!!!!!! Establishing Socket Connection for ${userId}`)

    // TODO: We should be sending a token
    const socket = new Socket(`ws://localhost:4000/socket`, {
        // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
        params: { user_id: userId }
    })
    socket.onOpen( ev =>  {
        console.log("Open ", socket.isConnected())
    })
    socket.onError( ev => console.log("ERROR: ", ev) )
    socket.onClose( e => console.log("CLOSE: ", e))
    socket.connect()


    const channel: Channel = socket.channel(`journal:${userId}`, {});
    channel.join()
        .receive("error", err => console.log("ERROR TRYING TO JOINNNNN", err))
        .receive("timeout", () => console.log("Timeout error"))
        .receive("ok", () => channel.push("test", {"user_id": userId}))
    channel.onClose(() => console.log("Closed for Business"))
    channel.on("end_session", payload => channel.leave())

    return channel
}

function appendWebNoteToJournal(webNote, journal: PeakWikiPage): JournalEntry {
    const today: JournalEntry = journal.body[0] as JournalEntry
    const newSlateNode = omit(['body', 'note_type'], {...webNote, type: ELEMENT_WEB_NOTE, children: webNote.body[0].children})

    console.log(`Today`, today)
    console.log(`WEB NOTE`, webNote)
    console.log(`NOTE TO APPEND`, newSlateNode)

    return {...today, body: [...today.body, newSlateNode]}
}

export const useJournalSubscription = () => {
    const user = useCurrentUser()
    const dispatch = useDispatch()
    const journal = useJournal()
    const currentUserAccountId = user.id

    let socket: Socket

    useEffect(() => {

        if (!socket) {
            const channel: Channel = establishSocketConnectionToUsersChannel(currentUserAccountId)
            channel.on("web_note_created", res => {
                const appState: AppState = store.getState()
                console.log(`RES`, res)
                console.log(res.note)
                const newJournalEntryForToday: JournalEntry = appendWebNoteToJournal(res.note, appState.peakWikiState[JOURNAL])
                console.log(`NEW for today:`, newJournalEntryForToday)
                dispatch(updateJournalEntry(newJournalEntryForToday))
            })

        } else {
            console.log(`Already have a socket for ${currentUserAccountId}`)
        }
    }, [currentUserAccountId, journal.body]);
}

