import {message} from "antd";
import {createWebNoteRequest} from "../../client/webNotes";
import {Node} from "slate";
import {PeakTag} from "../../types";
import {futureCreatePeakTags} from "../../client/tags-base";
import {Channel, Socket} from "phoenix";

export const submitNote = (userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string) => {
    futureCreatePeakTags(userId, selectedTags).catch(res => {
        message.warn("Failed to create the new tags. Let Devon know")
    })

    const newWebNote = { "title": pageTitle, "url": pageUrl, favIconUrl, body}
    return createWebNoteRequest(userId, newWebNote, selectedTags).then(res => {
        message.success("Saved your note!")
    })
}

export const submitNoteViaWebsockets = (socketChannel: Channel, userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string) => {
    socketChannel.push("submit_web_note", {"user_id": userId})
}

