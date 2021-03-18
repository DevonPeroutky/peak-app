/*global chrome*/
import * as React from "react";
import {notification} from "antd";
import {SavePageHeaderContent} from "./components/save-page-header-content/SavePageHeaderContent";
import {SavePageContent} from "./components/save-page-content/SavePageContent";
import {PeakTag} from "../../../../types";
import cn from 'classnames';
import {
    ACTIVE_TAB_KEY,
    ActiveTabState,
    EDITING_STATE,
    FOCUS_STATE,
    SUBMISSION_STATE, TAGS_KEY
} from "../../../constants/constants";
import {deleteItem, getItem} from "../../../utils/storageUtils";
import {Node} from "slate";
import {SubmitNoteMessage} from "../../../constants/models";
import 'antd/lib/divider/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import 'antd/lib/list/style/index.css';
import "./save-page-message.scss";
import {sendSubmitNoteMessage, syncActiveTabState} from "../../utils/messageUtils";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";
import Tab = chrome.tabs.Tab;

notification.config({
    placement: 'topRight',
    top: 0,
    duration: 1,
    rtl: false,
});

interface SavedPageStateProps {
    editing?: EDITING_STATE,
    saving: SUBMISSION_STATE,
    focusState: FOCUS_STATE,
    shouldSubmit: boolean
}

export interface SavedPageContentProps {
    tabId: number,
    userId: string,
    pageTitle: string,
    pageUrl: string,
    favIconUrl: string,
    tags: PeakTag[]
    nodesToAppend?: Node[],
}
export interface SavedPageProps extends SavedPageContentProps, SavedPageStateProps { };
export const NOTIFICATION_KEY = "saved-page-message"

function deriveDuration(saving: SUBMISSION_STATE, editing: EDITING_STATE, tagFocus: FOCUS_STATE): number {
   if (tagFocus === FOCUS_STATE.Focus) {
       return 0
   }

   if (saving === SUBMISSION_STATE.Saving || editing === EDITING_STATE.Editing) {
       return 0
   }
   return 2

}


export const openMessage = (props: SavedPageProps) => {
    const { saving, editing, tabId, focusState } = props
    const duration = deriveDuration(saving, editing, focusState)
    console.log(`STATE OF DA WURLD, `, props)
    notification.open({
        message: <SavePageHeaderContent saving={saving} editing={editing}/>,
        className: cn('saved-page-message', (editing === EDITING_STATE.Editing) ? "drawer-mode" : ""),
        key: NOTIFICATION_KEY,
        duration: duration,
        description: <SavePageContent editing={editing} {...props}/>,
        onClose: () => closeMessage(tabId)
    });
};

// Called whenever user saves the page by pressing CMD+SHIFT+S
export function openSavePageMessage(currTab: Tab, userId: string, tags: PeakTag[]): void {
    getItem(ACTIVE_TAB_KEY, (data) => {
        const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY] as ActiveTabState
        console.log(`ACTIVE TAB: `, activeTab)

        if (activeTab && activeTab.tabId === currTab.id) {
            console.log(`SAVING THE MESSAGE `, activeTab)
            // User pressed the Save hotkey with the Message already open, which means they are saving the metadata
            // --> Fetch the selectedTags, body, and pageTitle
            // --> Re-save the bookmark w/metadata and close the message
            openMessage({
                tabId: currTab.id,
                userId: userId,
                saving: SUBMISSION_STATE.Saving,
                editing: activeTab.editingState,
                pageUrl: currTab.url,
                favIconUrl: currTab.favIconUrl,
                pageTitle: currTab.title,
                tags: tags,
                focusState: activeTab.focusState,
                nodesToAppend: null,
                shouldSubmit: true,
            })
        } else {
            // User initiating the Sequence on a new Tab
            // --> Save the bookmark and give the user the option to additionally add tags/notes
            console.log(`OPENING NEW MESSAGE`)
            openMessage({
                tabId: currTab.id,
                userId: userId,
                saving: SUBMISSION_STATE.Saving,
                editing: EDITING_STATE.NotEditing,
                favIconUrl: currTab.favIconUrl,
                pageUrl: currTab.url,
                pageTitle: currTab.title,
                tags: tags,
                focusState: FOCUS_STATE.NotFocused,
                nodesToAppend: null,
                shouldSubmit: false,
            })

            sendSubmitNoteMessage(
                currTab.id,
                userId,
                [],
                currTab.title,
                currTab.url,
                currTab.favIconUrl,
                INITIAL_PAGE_STATE.body as Node[]
            )
        }

        // Needed so users can still scroll w/Drawer open
        document.body.style.setProperty("overflow", "auto")
    })
}

// Called after we have successfully saved a note (either initial or metadata)
export function updateSavePageMessage(submitNoteMessage: SubmitNoteMessage) {
    getItem(null, (data) => {
        const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY] as ActiveTabState

        const editingState = (activeTab && activeTab.editingState === EDITING_STATE.Editing) ? EDITING_STATE.Editing : EDITING_STATE.NotEditing
        const saving = (editingState === EDITING_STATE.Editing) ? SUBMISSION_STATE.MetadataSaved : SUBMISSION_STATE.Saved
        const focusState = (activeTab) ? activeTab.focusState : FOCUS_STATE.NotFocused
        const newActiveTabState: ActiveTabState = {...submitNoteMessage, focusState: focusState, editingState: editingState} as ActiveTabState
        syncActiveTabState(submitNoteMessage.tabId, newActiveTabState, () =>
            openMessage({
                tabId: submitNoteMessage.tabId,
                userId: submitNoteMessage.userId,
                pageTitle: submitNoteMessage.pageTitle,
                pageUrl: submitNoteMessage.pageUrl,
                tags: submitNoteMessage.selectedTags,
                favIconUrl: submitNoteMessage.favIconUrl,
                focusState: focusState,
                saving: saving,
                editing: editingState,
                shouldSubmit: false
            })
        )
    })

}

// Removes the message from the user's screen
export const closeMessage = (tabId: number) => {
    deleteItem([tabId.toString(), ACTIVE_TAB_KEY], () => {
        notification.close(NOTIFICATION_KEY)
    })
}

export const reRenderMessage = () => {
    getItem([ACTIVE_TAB_KEY, TAGS_KEY], data => {
        const activeTab: ActiveTabState = data[ACTIVE_TAB_KEY]
        const tags: PeakTag[] = data[TAGS_KEY]
        console.log(`Existing Page `, activeTab)
        const existingPage: SavedPageProps = {...activeTab, tags: tags, saving: SUBMISSION_STATE.Saved, shouldSubmit: false, editing: activeTab.editingState}
        console.log(`CANDIDATE PAGE `, existingPage)
        openMessage(existingPage)
    })
}
