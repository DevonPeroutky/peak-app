/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteModal";
import Tab = chrome.tabs.Tab;
import {ChromeExtMessage, MessageType, SavePageMessage} from "../constants/models";

// ---------------------------------------------------
// Mount Drawer to DOM
// ---------------------------------------------------
chrome.storage.sync.get(function (data) {
    const app = document.createElement('div');
    app.id = "my-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)
});
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

function openDrawer(currTab: Tab): void {
    console.log(`CURRENT TAB`)
    console.log(currTab)
    chrome.storage.sync.set({[currTab.id]: true}, () =>createDrawer(currTab))
}

function createDrawer(tab: Tab) {
    const tabId: string = tab.id.toString()
    chrome.storage.sync.get(function (data) {
        const props: SaveNoteDrawerProps = {
            ...data,
            pageUrl: tab.url,
            favIconUrl: tab.favIconUrl,
            pageTitle: tab.title,
            visible: data[tabId],
            closeDrawer: () => removeDrawer(tabId),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    });
}

function removeDrawer(key: string) {
    console.log(`REMOVING THE THING: ${key}`)
    chrome.storage.sync.remove([key], () => {
        console.log(`SUCCESS?`)
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

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
            chrome.storage.sync.get(function (data) {
                console.log(data)
                openDrawer(openDrawerMessage.tab)
            });
            break;
    }
});
