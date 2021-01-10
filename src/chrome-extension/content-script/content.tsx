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
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";
import {message} from "antd";
import {ACTIVE_TAB_KEY} from "../constants/constants";

// ---------------------------------------------------
// Mount Drawer to DOM
// ---------------------------------------------------
chrome.storage.sync.get(function (data) {
    console.log(`----------> MOUNTING THE MODALLLL`)
    const app = document.createElement('div');
    app.id = "my-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)
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
            shouldSubmit: shouldSubmit,
            closeDrawer: () => removeDrawer(),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    }

    chrome.storage.sync.get(ACTIVE_TAB_KEY, (data) => {
        console.log(`Current Tab ID: ${currTab.id}`)
        console.log(`WHAT IS IN STORAGE`)
        console.log(data)
        chrome.storage.sync.set({"activeTab": currTab.id}, () => {
            const activeTabId: number = data[ACTIVE_TAB_KEY]
            console.log(`TAGS: `)
            console.log(tags)
            const alreadyOpen: boolean = currTab.id === activeTabId
            createDrawer(activeTabId, alreadyOpen)
        })
    })

}

function removeDrawer() {
    chrome.storage.sync.remove([ACTIVE_TAB_KEY], () => {
        console.log(`SUCCESS?`)
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

export const sendSubmitNoteMessage = (tabId: number, userId: string, selectedTags: PeakTag[], pageTitle: string, pageUrl: string, favIconUrl: string, body: Node[], closeDrawer: (res) => void) => {
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
    chrome.runtime.sendMessage(message, closeDrawer);
};

// ---------------------------------------------------
// Listen for Messages
// ---------------------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    console.log(`Received Message: ${request.message_type}`);
    switch (request.message_type) {
        case MessageType.SaveToPeak:
            console.log(`Opening the DRAWER!`)
            console.log(request)
            const openDrawerMessage: SavePageMessage = request as SavePageMessage;
            openDrawer(openDrawerMessage.tab, openDrawerMessage.user_id, openDrawerMessage.tags)
            break;
        case MessageType.CloseDrawer:
            console.log(`Closing the DRAWER`)
            console.log(request)
            removeDrawer()
            break;
        case MessageType.Message_User:
            console.log(`Message the user`)
            console.log(request)
            const messageUser: MessageUserMessage = request as MessageUserMessage;
            message.error(messageUser.message)
    }
});


