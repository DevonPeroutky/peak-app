import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../redux/slices/tagSlice";
import {Node} from "slate";
import {ANT_MESSAGE_THEME} from "./constants";

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

export interface MessageUserMessage extends ChromeExtMessage {
    message: string
    message_theme: ANT_MESSAGE_THEME
}

export interface SavePageMessage extends ChromeExtMessage {
    user_id: string,
    tags: PeakTag[],
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
