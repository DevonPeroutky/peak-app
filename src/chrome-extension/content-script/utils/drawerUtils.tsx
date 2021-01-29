/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../../types";
import {ACTIVE_DRAWER_STATE_KEY, ACTIVE_TAB_KEY, TAGS_KEY} from "../../constants/constants";
import {setItemInChromeState} from "../../utils/storageUtils";
import {SubmitNoteMessage} from "../../constants/models";
import {sleep} from "../../utils/generalUtil";
import {Node} from "slate";
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteDrawer";

export function openDrawer(currTab: Tab, userId: string, tags: PeakTag[]): void {
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

export function removeDrawer() {
    chrome.storage.sync.remove([ACTIVE_TAB_KEY], () => {
        console.log(`SUCCESS?`)
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

export function removeDrawerWithSavedMessage(message: SubmitNoteMessage) {
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

export function rerenderDrawer(nodesToAppend: Node[]) {
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
