import Tab = chrome.tabs.Tab;

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
    AddToReadingList
}

export interface ChromeExtMessage {
    message_type: MessageType
}

export interface SavePageMessage extends ChromeExtMessage {
    user_id: string,
    tab: Tab
}
