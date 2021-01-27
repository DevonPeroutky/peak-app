import axios from 'axios';
import {ChromeExtMessage, ChromeUser, MessageType, SavePageMessage, SubmitNoteMessage} from "../constants/models";
import {loadUserRequest} from "../../client/user";
import { submitNoteViaWebsockets} from "../utils/noteUtil";
import {sendMessageToUser, sendSuccessfulSyncMessage} from "../utils/messageUtil";
import {injectContentScriptOpenDrawer} from "../utils/contentUtils";
import {loadTags} from "../utils/tagUtil";
import {setItemInChromeState} from "../utils/storageUtils";
import {Peaker} from "../../types";
import {Channel, Socket} from 'phoenix';
import {establishSocketConnectionToUsersChannel} from "../../utils/socketUtil";

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
        console.log(chrome_user)
        loadUserRequest(chrome_user.id)
            .then(r => {
                const user: Peaker = r.data.data as Peaker;
                console.log(`Syncing user to chrome storage`, user)
                setItemInChromeState("user", user)

                if (!channel) {
                    // TODO Remove the redux dependency from this
                    channel = establishSocketConnectionToUsersChannel(user.id)
                }
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

// ---------------------------------------
// Listen for Messages from Content Script
// ---------------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    switch (request.message_type) {
        case MessageType.PostFromBackgroundScript:
            const submitNodeMessage: SubmitNoteMessage = request as SubmitNoteMessage;
            submitNoteViaWebsockets(
                channel,
                submitNodeMessage.userId,
                submitNodeMessage.selectedTags,
                submitNodeMessage.pageTitle,
                submitNodeMessage.favIconUrl,
                submitNodeMessage.body,
                submitNodeMessage.pageUrl
            )
                .receive("ok", _ => {
                    console.log(`Received the message`)
                    sendSuccessfulSyncMessage(submitNodeMessage)
                })
                .receive("timeout", _ => {
                    console.log(`WE ARE TIMING OUT?????`)
                    sendMessageToUser(submitNodeMessage.tabId, "error", "Server timed out. Tell Devon.")
                })
                .receive("error", _ => sendMessageToUser(submitNodeMessage.tabId, "error", "Failed to save your note. Tell Devon."))
    }
});
