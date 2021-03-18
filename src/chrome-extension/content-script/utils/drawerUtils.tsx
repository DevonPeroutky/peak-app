/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../../types";
import {SUBMISSION_STATE, TAGS_KEY} from "../../constants/constants";
import {deleteItem, getItem, setItem} from "../../utils/storageUtils";
import {SubmitNoteMessage} from "../../constants/models";
import {Node} from "slate";
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteDrawer";
import {is, isEmpty} from "ramda";
import {syncCurrentDrawerState} from "./messageUtils";
import {INITIAL_PAGE_STATE} from "../../../constants/editor";
import {sleep} from "../../utils/generalUtil";

export function removeDrawer(activeTabId: string) {
    deleteItem([activeTabId], () => {
        unmountComponentAtNode(document.getElementById('my-extension-root'))
    })
}

