import {MessageType} from "../../constants/models";
import {loadTagsFromBackend} from "./tagUtil";
import {sendMessageToUser, sendOpenSavePageDrawerMessage} from "./messageUtil";
import {Peaker, PeakTag} from "../../../types";
import {logUserIn} from "./authUtil";
import {TAGS_KEY} from "../../constants/constants";

type Tab = chrome.tabs.Tab;

function fetchTagsAndOpenDrawer(userId: string, activeTab: Tab) {
    loadTagsFromBackend(userId )
        .then(tags => {
            sendOpenSavePageDrawerMessage(activeTab, userId, tags)
        }).catch(err => {
            sendMessageToUser(activeTab.id, "error", "Failed to load your tags. Tell Devon.")
            chrome.storage.sync.get(TAGS_KEY, (data) => {
                const tags = data[TAGS_KEY] || []
                sendOpenSavePageDrawerMessage(activeTab, userId, tags)
            })
    });
}

function tellDrawerToSubmit(userId: string, activeTab: Tab) {
    chrome.storage.sync.get([TAGS_KEY], (data) => {
        const tags: PeakTag[] = data[TAGS_KEY]
        sendOpenSavePageDrawerMessage(activeTab, userId, tags)
    })
}

export function injectContentScriptOpenDrawer() {
    function injectContentScript(user: Peaker) {
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            const activeTab: Tab = tabs[0]

            // Idempotently Inject ContentScript
            chrome.tabs.sendMessage(activeTab.id, { message_type: MessageType.Ping }, responseMessage => {
                // Content Script did respond so it must not be there
                if (!responseMessage) {

                    /**
                     * We have to inject lazily vs. declaratively in the manifest, because the css has conflicts with varies website
                     * and this way we minimize the potential conflicts. We also need to inject the content script, as opposed
                     * to injectCSS, because injecting stylesheets with injectCSS will not respect !important.
                     */
                    chrome.tabs.executeScript({ file: 'content.js'}, () => fetchTagsAndOpenDrawer(user.id, activeTab));
                } else {
                    console.log(`Content script already there. Stand down.`)
                    tellDrawerToSubmit(user.id, activeTab)
                }
            });
        })
    }

    chrome.storage.sync.get("user", data => {
        const user: Peaker | null | undefined = data["user"]
        if (user) {
            console.log(`User Already exists.`)
            injectContentScript(user)
        } else {
            logUserIn(injectContentScript)
        }
    })
}
