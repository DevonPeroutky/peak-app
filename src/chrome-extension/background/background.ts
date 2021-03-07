import axios from 'axios';
import {ChromeExtMessage, ChromeUser, MessageType, SubmitNoteMessage} from "../constants/models";
import {loadUserRequest, login_via_chrome_extension} from "../../client/user";
import {submitNoteViaWebsockets} from "./utils/noteUtil";
import {sendMessageToUser, sendSuccessfulSyncMessage} from "./utils/messageUtil";
import {injectContentScriptOpenDrawer} from "./utils/contentUtils";
import {setItemInChromeState} from "../utils/storageUtils";
import {Peaker} from "../../types";
import {Channel} from 'phoenix';
import {ACTIVE_TAB_KEY} from "../constants/constants";
import {sleep} from "../utils/generalUtil";
import {establishSocketChannelConnection} from "./utils/socketHelper";
import {message} from "antd";

let channel: Channel

chrome.storage.sync.clear()

// --------------------------------
// Fetch User Auth Token
// --------------------------------
chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        console.error("ERROR RETRIEVING THE AUTH TOKEN", chrome.runtime.lastError.message);
        return;
    }
    console.log(`Token: ${token}`)

    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`).then(r => {
        const chrome_user: ChromeUser = r.data as ChromeUser;
        console.log(`CHROME USER: `, chrome_user)
        // loadUserRequest(chrome_user.id)
        login_via_chrome_extension(chrome_user.id)
            .then(r => {
                const user: Peaker = r.data as Peaker;
                console.log(`Syncing user to chrome storage`, user)
                setItemInChromeState("user", user)

                establishSocketChannelConnection(channel, user.id).then(c => {
                    channel = c
                })
            }).catch(err => console.log(`Failed to load user from Backend: ${err.toString()}`))
    }).catch(err => console.error(`ERRORINGGGGGGG: ${err.toString()}`));
});

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
chrome.tabs.onActivated.addListener(function (tab) {
    setItemInChromeState(ACTIVE_TAB_KEY, tab.tabId)
})

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
