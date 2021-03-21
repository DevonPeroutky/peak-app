import {createWebNoteRequest} from "../../../client/webNotes";
import {Node} from "slate";
import {PeakTag} from "../../../types";
import {futureCreatePeakTags} from "../../../client/tags-base";
import {Channel, Push, Socket} from "phoenix";
import {ELEMENT_WEB_NOTE} from "../../../common/rich-text-editor/plugins/peak-knowledge-plugin/constants";
import {getCurrentFormattedDate} from "../../../utils/time";
import {STUB_TAG_ID} from "../../../redux/slices/tags/types";
import {AxiosResponse} from "axios";

export function submitNote (userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string): Promise<AxiosResponse<{book: any}>> {
    return futureCreatePeakTags(userId, selectedTags)
        .then(res => {
            const tags = selectedTags.filter(t => t.id != STUB_TAG_ID).concat(res.tags)
            const newWebNote = { "title": pageTitle, "url": pageUrl, favIconUrl, body}
            return createWebNoteRequest(userId, newWebNote, tags)
        })
}

export function submitNoteViaWebsockets(socketChannel: Channel, userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string): Promise<Push> {
    const currentDate = getCurrentFormattedDate()

    return futureCreatePeakTags(userId, selectedTags).then(res => {
        const tags = selectedTags.filter(t => t.id != STUB_TAG_ID).concat(res.tags)
        return socketChannel
            .push("submit_web_note", {
                "user_id": userId,
                "note": {
                    title: pageTitle,
                    selected_tags: tags,
                    body: body,
                    url: pageUrl,
                    icon_url: favIconUrl,
                    note_type: ELEMENT_WEB_NOTE,
                },
                "entry_date": currentDate
            })
    })

}
