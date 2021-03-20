import {PeakTag} from "../../../types";
import {Node} from "slate";
import {MessageType, SubmitNoteMessage} from "../../constants/models";
import {getItem, setItem} from "../../utils/storageUtils";
import {
    ACTIVE_TAB_KEY,
    ActiveTabState,
    EDITING_STATE,
    FOCUS_STATE,
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

// Current Way:
//  syncActiveTabState(tabId, { focusState: FOCUS_STATE.NotFocused }, reRenderMessage)
export const syncActiveTabState = (tabId: number, payload: {}, callback?) => {
    getItem(ACTIVE_TAB_KEY, data => {
        const currTabState: ActiveTabState = data[ACTIVE_TAB_KEY]
        const newTabState = { ...currTabState, ...payload, tabId: tabId }
        console.log(`EXISTING: `, currTabState)
        console.log(`NEW: `, newTabState)
        setItem(ACTIVE_TAB_KEY, newTabState, callback)
    })
}

export const updateMessageInPlace = (tabId: number, payload: {}) => {
    console.log(`Updating the Message (Tab: ${tabId}) w/payload: `, payload)
    syncActiveTabState(tabId, payload, () => {
        getItem(ACTIVE_TAB_KEY, data => {
            const currTabState: ActiveTabState = data[ACTIVE_TAB_KEY]
            const newTabState = { ...currTabState, ...payload, tabId: tabId }
            console.log(`EXISTING: `, currTabState)
            console.log(`NEW: `, newTabState)
            setItem(ACTIVE_TAB_KEY, newTabState, reRenderMessage)
        })
    })
}
const reRenderMessage = () => {
    getItem([ACTIVE_TAB_KEY, TAGS_KEY], data => {
        const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY]
        const tags: PeakTag[] = data[TAGS_KEY]
        const existingPage: SavedPageProps = {...activeTab, tags: tags, saving: SUBMISSION_STATE.Saved, shouldSubmit: false, editing: activeTab.editingState}
        openMessage(existingPage)
    })
}

