import {AddPageMessage, MessageType, SavePageMessage, UserMessage, UserNotification} from "./constants/models";
import {ReactNode} from "react";

type Tab = chrome.tabs.Tab;

export const sendNotificationToUser = (activeTab: Tab, message: ReactNode) => {
    const userMessage: UserNotification = {
        "message_type": MessageType.Notify_User,
        "id": "0",
        "message": message,
    };
    console.log("Sending message to user!");
    chrome.tabs.sendMessage(activeTab.id, userMessage);
};

export const sendMessageToUser = (activeTab: Tab, message: string) => {
    const userMessage: UserMessage = {
        "message_type": MessageType.Message_User,
        "id": "0",
        "message": message,
    };
    console.log("Sending message to user!");
    chrome.tabs.sendMessage(activeTab.id, userMessage);
};

export const sendLinkToReadingListMessage = (activeTab: Tab, linkUrl: string, userId: string) => {
    const message: AddPageMessage = {
        "message_type": MessageType.AddToReadingList,
        "item_type": "link",
        "link": linkUrl,
        "user_id": userId
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const sendCurrentPageToReadingListMessage = (userId: string, activeTab: Tab) => {
    console.log(`Sending message for Tab ${activeTab.id} and User ${userId}`);
    const message: AddPageMessage = {
        "message_type": MessageType.AddToReadingList,
        "item_type": "page",
        "link": activeTab.url,
        "user_id": userId,
        "title": activeTab.title
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const sendOpenSavePageModalMessage = (activeTab: Tab, userId: string) => {
    console.log(`Sending the Open Page Model!`);
    const message: SavePageMessage = {
        "message_type": MessageType.SaveToPeak,
        "user_id": userId
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const onActiveTab = (callback: (t: Tab) => void) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        const activeTab = tabs[0];
        callback(activeTab)
    })
}