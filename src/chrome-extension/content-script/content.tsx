/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteDrawer";
import {ChromeExtMessage, MessageType, SavePageMessage, SubmitNoteMessage} from "../constants/models";
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";

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

function openDrawer(currTab: Tab, userId: string): void {
    function createDrawer(tab: Tab) {
        const tabId: string = tab.id.toString()
        chrome.storage.sync.get(function (data) {
            const props: SaveNoteDrawerProps = {
                userId: userId,
                pageUrl: tab.url,
                favIconUrl: tab.favIconUrl,
                pageTitle: tab.title,
                tags: data["tags"],
                visible: data[tabId],
                closeDrawer: () => removeDrawer(tabId),
            } as SaveNoteDrawerProps

            const app = document.getElementById('my-extension-root')
            ReactDOM.render(<SaveNoteDrawer {...props} />, app)
        });
    }

    chrome.storage.sync.set({[currTab.id]: true}, () => createDrawer(currTab))
}

function removeDrawer(key: string) {
    console.log(`REMOVING THE THING: ${key}`)
    chrome.storage.sync.remove([key], () => {
        console.log(`SUCCESS?`)
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

export const sendSubmitNoteMessage = (tabId: number, userId: string, selectedTags: PeakTag[], pageTitle: string, pageUrl: string, favIconUrl: string, body: Node[], closeDrawer: () => void) => {
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
            openDrawer(openDrawerMessage.tab, openDrawerMessage.user_id)
            break;
        case MessageType.CloseDrawer:
            console.log(`Closing the DRAWER`)
            console.log(request)
            const closeDrawerMessage: SavePageMessage = request as SavePageMessage;
            removeDrawer(closeDrawerMessage.tab.id.toString())
    }
});

// console.log(`CHROME EXTENSION??? ${isChromeExtension}`)
// store.dispatch(createPage({ pageId: CHROME_EXTENSION, newPage: INITIAL_CHROME_EXT_STATE}))



