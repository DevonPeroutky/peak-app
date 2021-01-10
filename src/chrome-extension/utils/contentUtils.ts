import {MessageType} from "../constants/models";

export const idempotentlyInjectContentScript = (tabId: number, loadTagsAndOpenDrawer: () => void) => {
    chrome.tabs.sendMessage(tabId, { message_type: MessageType.Ping }, responseMessage => {
        // Content Script did respond so it must not be there
        if (!responseMessage) {
            chrome.tabs.executeScript({ file: 'content.js'}, loadTagsAndOpenDrawer);
        } else {
            console.log(`Content script already there. Stand down.`)
            loadTagsAndOpenDrawer()
        }
    });
}
