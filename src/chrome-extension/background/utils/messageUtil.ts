import {
    DeletePageMessage,
    MessageType,
    MessageUserMessage, MessageUserToLoginMessage,
    SavePageMessage,
    SubmitNoteMessage,
    SuccessfullyCreatedNoteMessage
} from "../../constants/models";
import Tab = chrome.tabs.Tab;
import {ANT_MESSAGE_THEME} from "../../constants/constants";
import {PeakTag} from "../../../types";

export const sendOpenSavePageDrawerMessage = (activeTab: Tab, userId: string, tags: PeakTag[]) => {
    const message: SavePageMessage = {
        "message_type": MessageType.SaveToPeakHotkeyPressed,
        "user_id": userId,
        "tags": tags,
        "tab": activeTab
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const sendSuccessfulSyncMessage = (ogMessage: SubmitNoteMessage, noteId: string) => {
    const message: SuccessfullyCreatedNoteMessage = {
        ...ogMessage,
        noteId: noteId,
        "message_type": MessageType.SuccessfullySavedNote
    };
    console.log(`----> SENDING SAVED MESSAGE: `, message)
    chrome.tabs.sendMessage(message.tabId, message);
};

export const sendSuccessfulDeleteMessage = (successfulDeleteMessage: DeletePageMessage) => {
    const message: DeletePageMessage = {
        ...successfulDeleteMessage,
        "message_type": MessageType.SuccessfullyRemovedNote
    };
    chrome.tabs.sendMessage(successfulDeleteMessage.tabId, message);
};

export const sendMessageToUser = (tabId: number, messageTheme: ANT_MESSAGE_THEME, messageTitle: string, messageContext: string, duration: number = 2) => {
    const message: MessageUserMessage = {
        message_type: MessageType.Message_User,
        message_theme: messageTheme,
        tabId: tabId,
        duration: duration,
        messageTitle: messageTitle,
        messageContext: messageContext
    }
    chrome.tabs.sendMessage(tabId, message);
}

export const sendUnauthedMessageToUser = (tabId) => {
    const message: MessageUserToLoginMessage = {
        message_type: MessageType.Message_User_To_Login,
        tabId: tabId,
    }
    chrome.tabs.sendMessage(tabId, message);
}

