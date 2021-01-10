import {ChromeExtMessage, MessageType, MessageUserMessage, SavePageMessage} from "../constants/models";
import Tab = chrome.tabs.Tab;
import {PeakTag} from "../../redux/slices/tagSlice";

export const sendOpenSavePageDrawerMessage = (activeTab: Tab, userId: string, tags: PeakTag[]) => {
    const message: SavePageMessage = {
        "message_type": MessageType.SaveToPeak,
        "user_id": userId,
        "tags": tags,
        "tab": activeTab
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

// export const sendSubmitNoteMessage = (tabId: number, userId: string, selectedTags: PeakTag[], pageTitle: string, pageUrl: string, favIconUrl: string, body: Node[]) => {
//     const message: SubmitNoteMessage = {
//         "message_type": MessageType.PostFromBackgroundScript,
//         "userId": userId,
//         "selectedTags": selectedTags,
//         "body": body,
//         "pageTitle": pageTitle,
//         "pageUrl": pageUrl,
//         "favIconUrl": favIconUrl,
//         "tabId": tabId
//     };
//     chrome.tabs.sendMessage(tabId, message);
// };

export const sendClosePageDrawerMessage = (activeTab: Tab, userId: string) => {
    const message: ChromeExtMessage = {
        "message_type": MessageType.CloseDrawer,
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export const sendMessageToUser = (tabId: number, messageBody: string) => {
    const message: MessageUserMessage = {
        message_type: MessageType.Message_User,
        message: messageBody
    }
    chrome.tabs.sendMessage(tabId, message);
}
