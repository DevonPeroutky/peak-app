import {MessageType} from "../../constants/models";
import {loadTagsFromBackend} from "./tagUtil";
import {sendMessageToUser, sendOpenSavePageDrawerMessage, sendUnauthedMessageToUser} from "./messageUtil";
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
            if (err.response.status === 401) {
                sendUnauthedMessageToUser(activeTab.id)
            } else {
                sendMessageToUser(activeTab.id, "error", "Failed to load your tags.", "Received an error response from the backend, tell Devon he sucks at programming")
            }
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

export function openDrawer() {
    function injectContentScriptAndLoadDrawer(user: Peaker) {
        idempotentlyInjectContentScript().then(result => {
            switch (result.res) {
                case INJECT_CONTENT_SCRIPT_STATE.INJECTED:
                    fetchTagsAndOpenDrawer(user.id, result.tab)
                    break
                case INJECT_CONTENT_SCRIPT_STATE.ALREADY_THERE:
                    console.log(`Content script already there. Stand down.`)
                    tellDrawerToSubmit(user.id, result.tab)
                    break
                default:
                    idempotentlyInjectContentScript().then(_ => {
                        sendMessageToUser(result.tab.id, "error", "Unexpected Error", "Failed to inject the content script for an unknown reason. Tell Devon.")
                    })
            }
        })
    }

    getItem("user", data => {
        const user: Peaker | null | undefined = data["user"]
        if (user) {
            console.log(`User Already exists.`)
            injectContentScriptAndLoadDrawer(user)
        } else {
            logUserIn(injectContentScriptAndLoadDrawer)
        }
    })
}

export function idempotentlyInjectContentScript(): Promise<{res: INJECT_CONTENT_SCRIPT_STATE, tab: Tab}> {
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
                    chrome.tabs.executeScript({ file: 'content.js'}, () => resolve({ res: INJECT_CONTENT_SCRIPT_STATE.INJECTED, tab: activeTab }));
                } else {
                    console.log(`Content script already there. Stand down.`)
                    resolve({ res: INJECT_CONTENT_SCRIPT_STATE.ALREADY_THERE, tab: activeTab })
                }
            });
        })
    })
}