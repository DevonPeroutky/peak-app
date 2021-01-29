import {
    MessageType,
    MessageUserMessage,
    SavePageMessage, SubmitNoteMessage
} from "../../constants/models";
import Tab = chrome.tabs.Tab;
import {ANT_MESSAGE_THEME} from "../../constants/constants";
import {PeakTag} from "../../../types";

export const sendOpenSavePageDrawerMessage = (activeTab: Tab, userId: string, tags: PeakTag[]) => {
    const message: SavePageMessage = {
        "message_type": MessageType.SaveToPeak,
        "user_id": userId,
        "tags": tags,
        "tab": activeTab
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const sendSuccessfulSyncMessage = (ogMessage: SubmitNoteMessage) => {
    const message: SubmitNoteMessage = {
        ...ogMessage,
        "message_type": MessageType.SuccessfullySavedNote
    };
    chrome.tabs.sendMessage(ogMessage.tabId, message);
};

export const sendMessageToUser = (tabId: number, messageTheme: ANT_MESSAGE_THEME, messageBody: string) => {
    const message: MessageUserMessage = {
        message_type: MessageType.Message_User,
        message_theme: messageTheme,
        message: messageBody
    }
    chrome.tabs.sendMessage(tabId, message);
}

