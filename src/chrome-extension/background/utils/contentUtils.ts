import {MessageType} from "../../constants/models";
import {loadTagsFromBackend} from "./tagUtil";
import {sendMessageToUser, sendOpenSavePageDrawerMessage} from "./messageUtil";
import {Peaker, PeakTag} from "../../../types";
import {logUserIn} from "./authUtil";
import {INJECT_CONTENT_SCRIPT_STATE, TAGS_KEY} from "../../constants/constants";
import {getItem} from "../../utils/storageUtils";

type Tab = chrome.tabs.Tab;

function fetchTagsAndOpenDrawer(userId: string, activeTab: Tab) {
    loadTagsFromBackend(userId )
        .then(tags => {
            sendOpenSavePageDrawerMessage(activeTab, userId, tags)
        }).catch(err => {
            sendMessageToUser(activeTab.id, "error", "Failed to load your tags.", "Received an error response from the backend, tell Devon he sucks at programming")
            getItem(TAGS_KEY, (data) => {
                const tags = data[TAGS_KEY] || []
                sendOpenSavePageDrawerMessage(activeTab, userId, tags)
            })
    });
}

function tellDrawerToSubmit(userId: string, activeTab: Tab) {
    getItem([TAGS_KEY], (data) => {
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

    getItem("user", data => {
        const user: Peaker | null | undefined = data["user"]
        if (user) {
            console.log(`User Already exists.`)
            injectContentScript(user)
        } else {
            logUserIn(injectContentScript)
        }
    })
}

export function idempotentlyInjectContentScript(): Promise<INJECT_CONTENT_SCRIPT_STATE> {
    return new Promise ((resolve, reject) => {
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
                    chrome.tabs.executeScript({ file: 'content.js'}, () => resolve(INJECT_CONTENT_SCRIPT_STATE.INJECTED));
                } else {
                    console.log(`Content script already there. Stand down.`)
                    resolve(INJECT_CONTENT_SCRIPT_STATE.ALREADY_THERE)
                }
            });
        })
    })
}