import {MessageType} from "../constants/models";
import {loadTags} from "./tagUtil";
import {sendMessageToUser, sendOpenSavePageDrawerMessage} from "./messageUtil";
import {TAGS_KEY} from "./storageUtils";
import {Peaker} from "../../types";
import {logUserIn} from "./authUtil";

type Tab = chrome.tabs.Tab;
const idempotentlyInjectContentScript = (tabId: number, loadTagsAndOpenDrawer: () => void) => {
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
export function injectContentScriptOpenDrawer() {
    function injectContentScript(user: Peaker) {
        function loadTagsAndOpenDrawer(userId: string, activeTab: Tab) {
            loadTags(userId )
                .then(tags => {
                    sendOpenSavePageDrawerMessage(activeTab, userId, tags)
                }).catch(err => {
                sendMessageToUser(activeTab.id, "error", "Failed to load your tags. Tell Devon.")
                chrome.storage.sync.get(TAGS_KEY, (data) => {
                    const tags = data[TAGS_KEY]
                    sendOpenSavePageDrawerMessage(activeTab, userId, tags)
                })
            });
        }
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            const activeTab: Tab = tabs[0]
            console.log(`CURRENT USER`, user)
            idempotentlyInjectContentScript(activeTab.id, () => loadTagsAndOpenDrawer(user.id, activeTab))
        })
    }

    chrome.storage.sync.get("user", data => {
        const user: Peaker | null | undefined = data["user"]
        if (user) {
            console.log(`DA USER`, user)
            injectContentScript(user)
        } else {
            console.log(`Need to login the user in`)
            logUserIn(injectContentScript)
        }
    })
}
