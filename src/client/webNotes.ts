import peakAxiosClient from "./axiosConfig";
import {ELEMENT_WEB_NOTE} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {Node} from "slate";

export function createWebNoteRequest(userId: string, web_note: { title: string, url: string, favIconUrl: string, body: Node[]}) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/books`, {
        "book": {
            title: web_note.title,
            body: web_note.body,
            url: web_note.url,
            icon_url: web_note.favIconUrl,
            note_type: ELEMENT_WEB_NOTE
        }
    })
}
