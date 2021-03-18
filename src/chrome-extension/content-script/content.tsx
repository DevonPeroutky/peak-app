/*global chrome*/
import React from 'react';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {
    ChromeExtMessage,
    MessageType,
    MessageUserMessage,
    SavePageMessage,
    SubmitNoteMessage
} from "../constants/models";
import {Node} from "slate";
import {message} from "antd";
import {addSelectionAsBlockQuote} from "./utils/editorUtils";
import {ACTIVE_TAB_KEY} from "../constants/constants";
import moment from "moment";
import {getItem} from "../utils/storageUtils";
import {
    closeMessage,
    openSavePageMessage,
    updateSavePageMessage
} from "./components/save-page-message/SavePageMessage";

console.log(`THE CONTENTTTT`)

// ---------------------------------------------------
// Debugging state changes
// ---------------------------------------------------
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
        const storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is: ".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

// ---------------------------------------------------
// Listen for Messages
// ---------------------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    switch (request.message_type) {
        case MessageType.SaveToPeakHotkeyPressed:
            const openDrawerMessage: SavePageMessage = request as SavePageMessage;
            console.log(`[CONTENT]`, openDrawerMessage)
            openSavePageMessage(
                openDrawerMessage.tab,
                openDrawerMessage.user_id,
                openDrawerMessage.tags
            )
            break;
        case MessageType.SuccessfullySavedNote:
            const m: SubmitNoteMessage = request as SubmitNoteMessage;
            updateSavePageMessage(m)
            break;
        case MessageType.Ping:
            // This is the healthcheck the background script uses to figure out if the content script is already injected
            sendResponse({ message_type: MessageType.Pong })
            break;
        case MessageType.Message_User:
            const messageUser: MessageUserMessage = request as MessageUserMessage;
            switch (messageUser.message_theme) {
                case "error":
                    message.error(messageUser.message)
                    closeMessage(messageUser.tabId.toString())
                    break;
                case "info":
                    message.info(messageUser.message)
                    break;
                case "success":
                    message.success(messageUser.message)
                    break;
                case "warning":
                    message.warning(messageUser.message)
                    break;
            }
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
            const activeTabId: string = data[ACTIVE_TAB_KEY].toString()
            // rerenderDrawer(activeTabId, nodes)
        })

    } else {
        body = ""
    }
});

