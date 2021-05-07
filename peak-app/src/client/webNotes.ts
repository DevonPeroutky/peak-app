import peakAxiosClient from "./axiosConfig";
import {ELEMENT_WEB_NOTE} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {Node} from "slate";
import {getCurrentFormattedDate} from "../utils/time";
import {PeakTag} from "../types";

export function deleteNoteRequest(userId: string, noteId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/books/${noteId}`)
}

// TODO: APPEND TAGS TO BODY
export function createWebNoteRequest(userId: string, web_note: { title: string, url: string, favIconUrl: string, body: Node[] }, selected_tags: PeakTag[]) {
    const currentDate = getCurrentFormattedDate()

    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "note": {
            title: web_note.title,
            selected_tags: selected_tags,
            body: web_note.body,
            url: web_note.url,
            icon_url: web_note.favIconUrl,
            note_type: ELEMENT_WEB_NOTE,
        },
        "entry_date": currentDate
    })
}
