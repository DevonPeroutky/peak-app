import {MessageType} from "../constants/models";

export const idempotentlyInjectContentScript = (tabId: number, loadTagsAndOpenDrawer: () => void) => {
    chrome.tabs.sendMessage(tabId, { message_type: MessageType.Ping }, responseMessage => {
        // Content Script did respond so it must not be there
        if (!responseMessage) {

            /**
             * We have to inject lazily vs. declaratively in the manifest, because the css has conflicts with varies website
             * and this way we minimize the potential conflicts. We also need to inject the content script, as opposed
             * to injectCSS, because injecting stylesheets with injectCSS will not respect !important.
             */
            chrome.tabs.executeScript({ file: 'content.js'}, loadTagsAndOpenDrawer);
        } else {
            console.log(`Content script already there. Stand down.`)
            loadTagsAndOpenDrawer()
        }
    });
}
