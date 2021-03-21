/*global chrome*/
import React from 'react';
import "./content.scss";
import "../../constants/utilities.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {
    ChromeExtMessage, DeletePageMessage,
    MessageType,
    MessageUserMessage,
    SavePageMessage,
    SuccessfullyCreatedNoteMessage
} from "../constants/models";
import {Node} from "slate";
import {message, notification} from "antd";
import {addSelectionAsBlockQuote} from "./utils/editorUtils";
import {ACTIVE_TAB_KEY, ActiveTabState, EDITING_STATE, SUBMISSION_STATE, TAGS_KEY} from "../constants/constants";
import moment from "moment";
import {getItem} from "../utils/storageUtils";
import {
    closeMessage,
    openMessage,
    openSavePageMessage,
    SavedPageProps,
    updateSavePageMessage
} from "./components/save-page-message/SavePageMessage";
import {PeakTag} from "../../types";
import {sleep} from "../utils/generalUtil";

// ---------------------------------------------------
// Debugging state changes
// ---------------------------------------------------
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
        const storageChange = changes[key];
        console.log(`Storage key ${key} changed. Old value was ${JSON.stringify(storageChange.oldValue)}, new value is: ${JSON.stringify(storageChange.newValue)}`);
    }
});

// ---------------------------------------------------
// Listen for Messages
// ---------------------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    switch (request.message_type) {
        case MessageType.SaveToPeakHotkeyPressed:
            const openDrawerMessage: SavePageMessage = request as SavePageMessage;
            console.log(`OPEN DRAWER MESSAGE `, openDrawerMessage)
            openSavePageMessage(
                openDrawerMessage.tab,
                openDrawerMessage.user_id,
                openDrawerMessage.tags
            )
            break;
        case MessageType.SuccessfullySavedNote:
            const m: SuccessfullyCreatedNoteMessage = request as SuccessfullyCreatedNoteMessage;
            updateSavePageMessage(m)
            break;
        case MessageType.SuccessfullyRemovedNote:
            const d = request as DeletePageMessage;
            closeMessage(d.tabId)
            break;
        case MessageType.Ping:
            // This is the healthcheck the background script uses to figure out if the content script is already injected
            sendResponse({ message_type: MessageType.Pong })
            break;
        case MessageType.Message_User:
            const messageUser: MessageUserMessage = request as MessageUserMessage;
            closeMessage(messageUser.tabId)
            sleep(100).then(() => {
                notification[messageUser.message_theme]({
                    message: messageUser.messageTitle,
                    description: messageUser.messageContext,
                    duration: messageUser.duration || 2,
                    className: "peak-custom-user-notification",
                    key: "one-off-message",
                })
            })
    }
});

// ---------------------------------------------------
// Listen for User Selections
// ---------------------------------------------------
var body = ""
document.addEventListener('mouseup', (event) => {
    const selection = document.getSelection()
    if (!selection.isCollapsed) {
        const text = window.getSelection().toString();
        const node_id: number = moment().valueOf()
        const nodes: Node[] = addSelectionAsBlockQuote(text, node_id)

        getItem(ACTIVE_TAB_KEY, data => {
            const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY] as ActiveTabState
            if (activeTab.editingState === EDITING_STATE.Editing) {
                appendNodesAsBlockquote(nodes)
            }
        })

    } else {
        body = ""
    }
});

const appendNodesAsBlockquote = (nodes: Node[]) => {
    getItem([ACTIVE_TAB_KEY, TAGS_KEY], data => {
        const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY]
        const tags: PeakTag[] = data[TAGS_KEY]

        const existingPage: SavedPageProps = {...activeTab, tags: tags, saving: SUBMISSION_STATE.Saved, shouldSubmit: false, editingState: activeTab.editingState}
        openMessage({...existingPage, nodesToAppend: nodes})
    })
}
