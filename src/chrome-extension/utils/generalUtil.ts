import {
    sendMessageToUser,
    sendOpenSavePageDrawerMessage
} from "./messageUtil";
import {loadTags} from "./tagUtil";
import {idempotentlyInjectContentScript} from "./contentUtils";

type Tab = chrome.tabs.Tab;

export function injectContentScriptOpenDrawer(userId: string) {
    function loadTagsAndOpenDrawer(userId: string, activeTab: Tab) {
        loadTags(userId).then(tags => {
            chrome.storage.sync.set({ "tags": tags}, () => {
                sendOpenSavePageDrawerMessage(activeTab, userId, tags)
            })
        }).catch(err => {
            sendMessageToUser(activeTab.id, "error", "Failed to load your tags. Tell Devon.")
        });
    }

    chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
        const activeTab: Tab = tabs[0]
        idempotentlyInjectContentScript(activeTab.id, () => loadTagsAndOpenDrawer(userId, activeTab))
    })
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
