import {message} from "antd";
import {createWebNoteRequest} from "../../client/webNotes";
import {Node} from "slate";
import {PeakTag} from "../../types";
import {futureCreatePeakTags} from "../../client/tags-base";
import {Channel, Push, Socket} from "phoenix";
import {ELEMENT_WEB_NOTE} from "../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {getCurrentFormattedDate} from "../../utils/time";

export const submitNote = (userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string) => {
    futureCreatePeakTags(userId, selectedTags).catch(res => {
        message.warn("Failed to create the new tags. Let Devon know")
    })

    const newWebNote = { "title": pageTitle, "url": pageUrl, favIconUrl, body}
    return createWebNoteRequest(userId, newWebNote, selectedTags).then(res => {
        message.success("Saved your note!")
    })
}

export function submitNoteViaWebsockets(socketChannel: Channel, userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string): Push {
    const currentDate = getCurrentFormattedDate()

    return socketChannel
        .push("submit_web_note", {
            "user_id": userId,
            "note": {
                title: pageTitle,
                selected_tags: selectedTags,
                body: body,
                url: pageUrl,
                icon_url: favIconUrl,
                note_type: ELEMENT_WEB_NOTE,
            },
            "entry_date": currentDate
        })
}
