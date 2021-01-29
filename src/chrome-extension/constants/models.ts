import Tab = chrome.tabs.Tab;
import {Node} from "slate";
import {ANT_MESSAGE_THEME} from "./constants";
import {PeakTag} from "../../types";

export interface ChromeUser {
    id: string
    email: string
    verified_email: string
    user_id: string
}

export enum MessageType {
    Message_User,
    Ping,
    Pong,
    SaveToPeak,
    SuccessfullySavedNote,
    PostFromBackgroundScript,
    AddToReadingList
}

export interface ChromeExtMessage {
    message_type: MessageType
}

export interface MessageUserMessage extends ChromeExtMessage {
    message: string
    tabId: number
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

