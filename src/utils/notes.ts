import moment from "moment";
import {PeakNote} from "../redux/slices/noteSlice";
import {store} from "../redux/store";
import {AppState} from "../redux";
import { sort } from 'ramda';

export function fetchNewestNote(): PeakNote | undefined {
    const notes: PeakNote[] = (store.getState() as AppState).notes
    const sortedNotes: PeakNote[] = sort((a, b) => {
        const dateA = moment(a.updated_at)
        const dateB = moment(b.updated_at)
        return (dateA.isAfter(dateB)) ? -1 : 1
    }, notes)
    return sortedNotes[0]
}