import {PeakTag} from "../../../types";
import {Node} from "slate";
import {MessageType, SubmitNoteMessage} from "../../constants/models";
import {setItem} from "../../utils/storageUtils";
import {ACTIVE_TAB_KEY, ActiveTabState, EDITING_STATE, SUBMISSION_STATE} from "../../constants/constants";
import {openMessage} from "../components/save-page-message/SavePageMessage";

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

export const syncCurrentDrawerState = (tabId: number, userId: string, selectedTags: PeakTag[], pageTitle: string, pageUrl: string, favIconUrl: string, body: Node[]) => {
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
    setItem(tabId.toString(), message)
};

export const syncActiveTabState = (tabId: number, editingState: EDITING_STATE, callback?) => {
    const activeTabState: ActiveTabState = { tabId: tabId, editingState: editingState }
    setItem(ACTIVE_TAB_KEY, activeTabState, () => callback())
}