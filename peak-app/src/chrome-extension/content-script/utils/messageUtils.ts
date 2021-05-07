import {PeakTag} from "../../../types";
import {Node} from "slate";
import {DeletePageMessage, MessageType, SubmitNoteMessage} from "../../constants/models";
import {getItem, setItem} from "../../utils/storageUtils";
import {
    ACTIVE_TAB_KEY,
    ActiveTabState, EDITING_STATE,
    SUBMISSION_STATE,
    TAGS_KEY
} from "../../constants/constants";
import {openMessage, SavedPageProps} from "../components/save-page-message/SavePageMessage";

export const sendSubmitNoteMessage = (tabId: number, userId: string, selectedTags: PeakTag[], pageTitle: string, pageUrl: string, favIconUrl: string, body: Node[]) => {
    const message: SubmitNoteMessage = {
        "message_type": MessageType.PostFromBackgroundScript,
        "userId": userId,
        "selectedTags": selectedTags,
        "body": body,
        "pageTitle": pageTitle,
        "pageUrl": pageUrl,
        "favIconUrl": favIconUrl,
        "tabId": tabId
    };
    chrome.runtime.sendMessage(message);
};

export const sendDeletePageMessage = (tabId: number, userId: string, noteId: string) => {
    const message: DeletePageMessage = {
        "message_type": MessageType.DeleteFromBackgroundScript,
        "userId": userId,
        "tabId": tabId,
        "noteId": noteId
    };
    chrome.runtime.sendMessage(message);
}

export const updateMessageInPlace = (tabId: number, payload: {}) => {
    getItem([ACTIVE_TAB_KEY, TAGS_KEY], data => {
        const currTabState: ActiveTabState = data[ACTIVE_TAB_KEY]
        const tags: PeakTag[] = data[TAGS_KEY]
        const newTabState = { ...currTabState, ...payload, tabId: tabId }
        const newPage: SavedPageProps = {
            ...newTabState,
            tags: tags,
            saving: SUBMISSION_STATE.Saved,
            shouldSubmit: false,
            editingState: currTabState.editingState,

            // Payload last so whatever was specified persists
            ...payload
        }
        setItem(ACTIVE_TAB_KEY, newTabState, () => openMessage(newPage))
    })
}

export function buildDeletePageCalback(tabId: number, userId: string, noteId: string): () => void {
    return () => {
        updateMessageInPlace(tabId, { editingState: EDITING_STATE.Deleting })
        sendDeletePageMessage(tabId, userId, noteId)
    }
}
