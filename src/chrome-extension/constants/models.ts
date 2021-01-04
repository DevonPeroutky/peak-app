import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";

export interface ChromeUser {
    id: string
    email: string
    verified_email: string
    user_id: string
}

export enum MessageType {
    Message_User,
    Notify_User,
    SaveToPeak,
    CloseDrawer,
    PostFromBackgroundScript,
    AddToReadingList
}

export interface ChromeExtMessage {
    message_type: MessageType
}

export interface SavePageMessage extends ChromeExtMessage {
    user_id: string,
    tab: Tab
}

export interface SubmitNoteMessage extends ChromeExtMessage {
    userId: string,
    selectedTags: PeakTag[],
    pageTitle: string,
    pageUrl: string,
    favIconUrl: string,
    body: Node[],
    tabId: number
}
