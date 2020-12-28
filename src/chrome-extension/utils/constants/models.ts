import {ReactNode} from "react";

export interface ChromeUser {
    id: string
    email: string
    verified_email: string
    user_id: string
}


// ------------------------------------
// Messaging
// ------------------------------------
export enum MessageType {
    Message_User,
    Notify_User,
    SaveToPeak,
    AddToReadingList
}

export interface ChromeExtMessage {
    message_type: MessageType
}

export interface AddPageMessage extends ChromeExtMessage {
    item_type: string
    link?: string
    title?: string
    user_id: string
}

export interface SavePageMessage extends ChromeExtMessage {
    title?: string
    user_id: string
}

export interface UserMessage extends ChromeExtMessage {
    id: string
    message: string
}

export interface UserNotification extends ChromeExtMessage {
    id: string
    message: ReactNode
}