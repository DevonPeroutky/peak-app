/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {SaveNoteDrawer, SaveNoteDrawerProps} from "./components/save-note-modal/SaveNoteDrawer";
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
import {openDrawer, removeDrawer, removeDrawerWithSavedMessage, rerenderDrawer} from "./utils/drawerUtils";
import {ACTIVE_TAB_KEY} from "../constants/constants";
import moment from "moment";

// ---------------------------------------------------
// Mount Drawer to DOM
// - This does not show the modal.
// ---------------------------------------------------
chrome.storage.sync.get(function (data) {
    console.log(`----------> MOUNTING THE MODALLLL`)
    console.log(`THE DATA`, data)
    const app = document.createElement('div');
    app.id = "my-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)
});

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
        case MessageType.SaveToPeak:
            const openDrawerMessage: SavePageMessage = request as SavePageMessage;
            console.log(`[CONTENT]`, openDrawerMessage)
            openDrawer(openDrawerMessage.tab, openDrawerMessage.user_id, openDrawerMessage.tags)
            break;
        case MessageType.SuccessfullySavedNote:
            const saveAndCloseDrawerMessage: SubmitNoteMessage = request as SubmitNoteMessage;
            removeDrawerWithSavedMessage(saveAndCloseDrawerMessage)
            break;
        case MessageType.Ping:
            sendResponse({ message_type: MessageType.Pong })
            // chrome.runtime.sendMessage({ message_type: MessageType.Pong });
            break;
        case MessageType.Message_User:
            const messageUser: MessageUserMessage = request as MessageUserMessage;
            switch (messageUser.message_theme) {
                case "error":
                    message.error(messageUser.message)
                    removeDrawer(messageUser.tabId.toString())
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

        chrome.storage.sync.get(ACTIVE_TAB_KEY, data => {
            const activeTabId: string = data[ACTIVE_TAB_KEY].toString()
            rerenderDrawer(activeTabId, nodes)
        })

    } else {
        body = ""
    }
});

