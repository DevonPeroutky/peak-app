/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteDrawer";
import {
    ChromeExtMessage,
    MessageType,
    MessageUserMessage,
    SavePageMessage,
    SubmitNoteMessage
} from "../constants/models";
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";
import {message} from "antd";
import {ACTIVE_DRAWER_STATE_KEY, ACTIVE_TAB_KEY} from "../constants/constants";
import {sleep} from "../utils/generalUtil";
import {addSelectionAsBlockQuote} from "../utils/editorUtils";
import Tab = chrome.tabs.Tab;
import {setItemInChromeState, TAGS_KEY} from "../utils/storageUtils";

// ---------------------------------------------------
// Mount Drawer to DOM
// ---------------------------------------------------
chrome.storage.sync.get(function (data) {
    console.log(`----------> MOUNTING THE MODALLLL`)
    const app = document.createElement('div');
    app.id = "my-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)

    chrome.storage.sync.remove([ACTIVE_TAB_KEY], () => {
        console.log(`Cleared the ACTIVE_TAB_KEY`)
    })
});

// Debugging state changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
        const storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

function openDrawer(currTab: Tab, userId: string, tags: PeakTag[]): void {
    function createDrawer(activeTabId: number, shouldSubmit: boolean) {
        const props: SaveNoteDrawerProps = {
            userId: userId,
            pageUrl: currTab.url,
            favIconUrl: currTab.favIconUrl,
            pageTitle: currTab.title,
            tags: tags,
            visible: true,
            tabId: currTab.id,
            shouldSubmit: shouldSubmit,
            closeDrawer: () => removeDrawer(),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    }

    chrome.storage.sync.get([ACTIVE_TAB_KEY], (data) => {
        setItemInChromeState(ACTIVE_TAB_KEY, currTab.id, () => {
            const activeTabId: number = data[ACTIVE_TAB_KEY]
            const alreadyOpen: boolean = currTab.id === activeTabId
            createDrawer(activeTabId, alreadyOpen)
        })
    })

    setItemInChromeState(TAGS_KEY, tags)

}

function removeDrawer() {
    chrome.storage.sync.remove([ACTIVE_TAB_KEY], () => {
        console.log(`SUCCESS?`)
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

function removeDrawerWithSavedMessage(message: SubmitNoteMessage) {
    chrome.storage.sync.get(["tags"], data => {
        const tags: PeakTag[] = data["tags"]

        const props: SaveNoteDrawerProps = {
            userId: message.userId,
            pageUrl: message.pageUrl,
            favIconUrl: message.favIconUrl,
            pageTitle: message.pageTitle,
            tags: tags,
            visible: true,
            tabId: message.tabId,
            shouldSubmit: false,
            submittingState: "submitted",
            closeDrawer: () => removeDrawer(),
        } as SaveNoteDrawerProps

        sleep(500).then(() => {
            const app = document.getElementById('my-extension-root')
            ReactDOM.render(<SaveNoteDrawer {...props} />, app)

            sleep(500).then(() => {
                removeDrawer()
            })
        })
    })
}

function rerenderDrawer(nodesToAppend: Node[]) {
    chrome.storage.sync.get(null, data => {
        const state: SubmitNoteMessage = data[ACTIVE_DRAWER_STATE_KEY]
        const tags: PeakTag[] = data["tags"]

        const props: SaveNoteDrawerProps = {
            userId: state.userId,
            pageUrl: state.pageUrl,
            favIconUrl: state.favIconUrl,
            pageTitle: state.pageTitle,
            tags: tags,
            visible: true,
            tabId: state.tabId,
            shouldSubmit: false,
            submittingState: "submitted",
            nodesToAppend: nodesToAppend,
            closeDrawer: () => removeDrawer(),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    })
}

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

// ---------------------------------------------------
// Listen for Messages
// ---------------------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    switch (request.message_type) {
        case MessageType.SaveToPeak:
            const openDrawerMessage: SavePageMessage = request as SavePageMessage;
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
                    removeDrawer()
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

var body = ""
document.addEventListener('mouseup', (event) => {
    const selection = document.getSelection()
    if (!selection.isCollapsed) {
        const text = window.getSelection().toString();
        const nodes: Node[] = addSelectionAsBlockQuote(text)
        rerenderDrawer(nodes)
    } else {
        body = ""
    }
});

