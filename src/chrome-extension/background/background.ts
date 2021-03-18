import axios from 'axios';
import {ChromeExtMessage, ChromeUser, MessageType, SubmitNoteMessage} from "../constants/models";
import {loadUserRequest, login_via_chrome_extension} from "../../client/user";
import {submitNoteViaWebsockets} from "./utils/noteUtil";
import {sendMessageToUser, sendSuccessfulSyncMessage} from "./utils/messageUtil";
import {injectContentScriptOpenDrawer} from "./utils/contentUtils";
import {deleteItem, getItem, getItemSizeFromChromeState, setItem} from "../utils/storageUtils";
import {Peaker} from "../../types";
import {Channel} from 'phoenix';
import {ACTIVE_TAB_KEY} from "../constants/constants";
import {sleep} from "../utils/generalUtil";
import {establishSocketChannelConnection} from "./utils/socketHelper";
import {message} from "antd";
import {logUserIn} from "./utils/authUtil";

let channel: Channel

// Do we want to do this????
chrome.storage.sync.clear()

// -------------------------------------
// Log user in and Fetch User Auth Token
// -------------------------------------
logUserIn((user) => {
    establishSocketChannelConnection(channel, user.id).then(c => {
        channel = c
    })
})

// --------------------------------
// Create Context Menu
// --------------------------------
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "add-to-reading-list",
        "title": "Add to Peak",
        "contexts": ["selection", "page", "link"]
    });
});

// --------------------------------
// Listen for HotKey commands
// --------------------------------
chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
        case "save-page":
            injectContentScriptOpenDrawer()
            break;
        default:
            console.log(`Command: ${command} ???`);
    }
});

// ------------------------------------------------
// Maintain activeTab in Storage for content script
// ------------------------------------------------
// chrome.tabs.onActivated.addListener(function (tab) {
//     setItem(ACTIVE_TAB_KEY, tab.tabId)
// })

// ---------------------------------------
// Listen for Messages from Content Script
// ---------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    switch (request.message_type) {
        case MessageType.PostFromBackgroundScript:
            const submitNodeMessage: SubmitNoteMessage = request as SubmitNoteMessage;
            establishSocketChannelConnection(channel, submitNodeMessage.userId).then(c => {
                channel = c
                console.log(`NOW WE ARE HERE??? `, c)
                const notesubmitFuture = submitNoteViaWebsockets(
                    c,
                    submitNodeMessage.userId,
                    submitNodeMessage.selectedTags,
                    submitNodeMessage.pageTitle,
                    submitNodeMessage.favIconUrl,
                    submitNodeMessage.body,
                    submitNodeMessage.pageUrl
                )

                notesubmitFuture.then(res => {
                    res
                        .receive("ok", _ => {
                            console.log(`Received the message`)
                            sleep(1000).then(() => sendSuccessfulSyncMessage(submitNodeMessage))
                        })
                        .receive("timeout", _ => {
                            console.log(`WE ARE TIMING OUT?????`)
                            sendMessageToUser(submitNodeMessage.tabId, "error", "Server timed out. Tell Devon.")
                        })
                        .receive("error", _ => {
                            sleep(500).then(() => sendMessageToUser(submitNodeMessage.tabId, "error", "Failed to save your note. Tell Devon."))
                        })
                }).catch(res => {
                    message.warn("Failed to create the new tags. Let Devon know")
                })
            })
    }
});

// -------------------------------------------
// Listen for tabs refreshing
// -------------------------------------------
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    deleteItem([ACTIVE_TAB_KEY, tabId.toString()] )
});
