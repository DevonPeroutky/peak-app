import {PeakTag} from "../../../types";
import {Node} from "slate";
import {MessageType, SubmitNoteMessage} from "../../constants/models";
import {setItemInChromeState} from "../../utils/storageUtils";
import {ACTIVE_DRAWER_STATE_KEY} from "../../constants/constants";

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
    setItemInChromeState(ACTIVE_DRAWER_STATE_KEY, message)
};

