/*global chrome*/
import * as React from "react";
import {notification} from "antd";
import {SavePageHeaderContent} from "./components/save-page-header-content/SavePageHeaderContent";
import {SavePageContent} from "./components/save-page-content/SavePageContent";
import {PeakTag} from "../../../../types";
import cn from 'classnames';
import {ACTIVE_TAB_KEY, EDITING_STATE, SUBMISSION_STATE} from "../../../constants/constants";
import {deleteItem, getItem, setItem} from "../../../utils/storageUtils";
import {removeDrawer} from "../../utils/drawerUtils";
import {Node} from "slate";
import {sleep} from "../../../utils/generalUtil";
import {SubmitNoteMessage} from "../../../constants/models";
import Tab = chrome.tabs.Tab;
import 'antd/lib/divider/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import 'antd/lib/list/style/index.css';
import "./save-page-message.scss";
import {sendSubmitNoteMessage} from "../../utils/messageUtils";
import {INITIAL_PAGE_STATE} from "../../../../constants/editor";

notification.config({
    placement: 'topRight',
    top: 0,
    duration: 0,
    rtl: false,
});

interface SavedPageStateProps {
    editing?: EDITING_STATE,
    saving: SUBMISSION_STATE,
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

export const openMessage = (props: SavedPageProps) => {
    const { saving, editing, tabId } = props
    notification.open({
        message: <SavePageHeaderContent saving={saving}/>,
        className: cn('saved-page-message', (editing === EDITING_STATE.Editing) ? "drawer-mode" : ""),
        duration: 0,
        key: NOTIFICATION_KEY,
        description: <SavePageContent editing={editing} {...props}/>,
        onClick: () => {
            console.log('Notification Clicked!');
        },
        onClose: () => closeMessage(tabId.toString())
    });
};

// Called whenever user saves the page by pressing CMD+SHIFT+S
export function openSavePageMessage(currTab: Tab, userId: string, tags: PeakTag[]): void {
    getItem(null, (data) => {
        const activeTab: number | undefined = data[ACTIVE_TAB_KEY] as number

        if (activeTab && activeTab === currTab.id) {
            console.log(`SAVING THE MESSAGE`)
            // User pressed the Save hotkey with the Message already open, which means they are saving the metadata
            // --> Fetch the selectedTags, body, and pageTitle
            // --> Re-save the bookmark w/metadata and close the message
            openMessage({
                tabId: currTab.id,
                userId: userId,
                saving: SUBMISSION_STATE.Saving,
                editing: EDITING_STATE.Editing,
                pageUrl: currTab.url,
                favIconUrl: currTab.favIconUrl,
                pageTitle: currTab.title,
                tags: tags,
                nodesToAppend: null,
                shouldSubmit: true,
            })

            sleep(500).then(() => {
                console.log(`DA FUCK WE DOING IN HERE???`)
                getItem(null, data => {
                    const tabInfo = data[currTab.id.toString()]
                    if (!currTab) {
                        console.error("We were expecting the tab information in chrome.storage")
                        return
                    }
                    console.log(tabInfo)
                })
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
        console.log(`THE STATE: `, data)
        const tabState = data[submitNoteMessage.tabId.toString()]
        console.log(`TAB STATE: `, tabState)
        const editingState = (tabState && tabState.editing === EDITING_STATE.Editing) ? EDITING_STATE.Editing : EDITING_STATE.NotEditing
        setItem(ACTIVE_TAB_KEY, submitNoteMessage.tabId, () =>
            openMessage({
                tabId: submitNoteMessage.tabId,
                userId: submitNoteMessage.userId,
                pageTitle: submitNoteMessage.pageTitle,
                pageUrl: submitNoteMessage.pageUrl,
                tags: submitNoteMessage.selectedTags,
                favIconUrl: submitNoteMessage.favIconUrl,
                saving: SUBMISSION_STATE.Saved,
                editing: editingState,
                shouldSubmit: false
            })
        )
    })

}

export const closeMessage = (tabId: string) => {
    deleteItem([tabId, ACTIVE_TAB_KEY], () => {
        notification.close(NOTIFICATION_KEY)
    })
}
