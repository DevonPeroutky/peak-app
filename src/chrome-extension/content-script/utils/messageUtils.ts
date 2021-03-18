import {PeakTag} from "../../../types";
import {Node} from "slate";
import {MessageType, SubmitNoteMessage} from "../../constants/models";
import {setItem} from "../../utils/storageUtils";
import {INITIAL_PAGE_STATE} from "../../../constants/editor";

interface SubmitBookmarkProps {
    tabId: number,
    userId: string,
    selectedTags: PeakTag[],
    pageTitle: string,
    pageUrl: string,
    favIconUrl: string,
    body?: Node[]
}
export const sendSubmitNoteMessage = (payload: SubmitBookmarkProps, callback?: () => void) => {
    const message: SubmitNoteMessage = {
        "message_type": MessageType.PostFromBackgroundScript,
        "userId": payload.userId,
        "selectedTags": payload.selectedTags,
        "body": payload.body || INITIAL_PAGE_STATE.body as Node[],
        "pageTitle": payload.pageTitle,
        "pageUrl": payload.pageUrl,
        "favIconUrl": payload.favIconUrl,
        "tabId": payload.tabId
    };
    chrome.runtime.sendMessage(message, callback);
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

export const getCurrentTabFromBackground = () => {
    chrome.runtime.sendMessage({ type: MessageType.Ping })
}