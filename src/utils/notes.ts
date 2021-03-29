import {PeakNote} from "../redux/slices/noteSlice";
import {store} from "../redux/store";
import {AppState} from "../redux";
import {fetchNewestNote} from "../client/notes";
import {Peaker} from "../types";




export function newestNodeAcrossAllAcounts(): Promise<PeakNote | null> {
    const currentUser: Peaker = (store.getState() as AppState).currentUser
    return fetchNewestNote(currentUser)

    // const notes: PeakNote[] = (store.getState() as AppState).notes
    // const sortedNotes: PeakNote[] = sort((a, b) => {
    //     const dateA = moment(a.updated_at)
    //     const dateB = moment(b.updated_at)
    //     return (dateA.isAfter(dateB)) ? -1 : 1
    // }, notes)
    // return sortedNotes[0]
}

export function buildNoteUrl(noteId: string) {
    return `/home/notes/${noteId}`
}