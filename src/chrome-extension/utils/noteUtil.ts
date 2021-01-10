import {futureCreatePeakTags} from "../../client/tags";
import {message} from "antd";
import {createWebNoteRequest} from "../../client/webNotes";
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";

export const submitNote = (userId: string, selectedTags: PeakTag[], pageTitle: string, favIconUrl: string, body: Node[], pageUrl: string) => {
    futureCreatePeakTags(userId, selectedTags).catch(res => {
        message.warn("Failed to create the new tags. Let Devon know")
    })

    const newWebNote = { "title": pageTitle, "url": pageUrl, favIconUrl, body}
    return createWebNoteRequest(userId, newWebNote, selectedTags).then(res => {
        message.success("Saved your note!")
    })
    // .then(res => {
    //     chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
    //         const activeTab: Tab = tabs[0];
    //         sendClosePageDrawerMessage(activeTab, userId)
    //     });
    // })
}
