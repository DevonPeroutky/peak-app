/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../../types";
import {SUBMITTING_STATE, TAGS_KEY} from "../../constants/constants";
import {setItemInChromeState} from "../../utils/storageUtils";
import {SubmitNoteMessage} from "../../constants/models";
import {sleep} from "../../utils/generalUtil";
import {Node} from "slate";
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteDrawer";
import {isEmpty} from "ramda";
import {syncCurrentDrawerState} from "./messageUtils";
import {INITIAL_PAGE_STATE} from "../../../constants/editor";

export function openDrawer(currTab: Tab, userId: string, tags: PeakTag[]): void {
    function createDrawer(activeTabId: number, shouldSubmit: boolean) {
        const submittingState: SUBMITTING_STATE = (shouldSubmit) ? "submitting" : "no"
        const props: SaveNoteDrawerProps = {
            userId: userId,
            pageUrl: currTab.url,
            favIconUrl: currTab.favIconUrl,
            pageTitle: currTab.title,
            tags: tags,
            visible: true,
            tabId: currTab.id,
            submittingState: submittingState,
            shouldSubmit: shouldSubmit,
            closeDrawer: () => removeDrawer(activeTabId.toString()),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    }

    chrome.storage.sync.get([currTab.id.toString()], (data) => {
        if (isEmpty(data)) {
            console.log(`Creating New Drawer`)
            createDrawer(currTab.id, false)
            syncCurrentDrawerState(currTab.id, userId, [], currTab.title, currTab.url, currTab.favIconUrl, INITIAL_PAGE_STATE.body as Node[])
        } else {
            console.log(`SUBMITTING`)
            createDrawer(currTab.id, true)
        }
    })

    setItemInChromeState(TAGS_KEY, tags)
}

export function removeDrawer(activeTabId: string) {
    chrome.storage.sync.remove([activeTabId], () => {
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
            closeDrawer: () => removeDrawer(message.tabId.toString()),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    })
}

export function rerenderDrawer(activeTabId: string, nodesToAppend: Node[]) {
    chrome.storage.sync.get([activeTabId], data => {
        if (isEmpty(data)) {
            return
        }

        const state: SubmitNoteMessage = data[activeTabId]
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
            submittingState: "no",
            nodesToAppend: nodesToAppend,
            closeDrawer: () => removeDrawer(activeTabId),
        } as SaveNoteDrawerProps

        const app = document.getElementById('my-extension-root')
        ReactDOM.render(<SaveNoteDrawer {...props} />, app)
    })
}
