import axios from 'axios';
import {ChromeExtMessage, ChromeUser, MessageType, SavePageMessage, SubmitNoteMessage} from "../constants/models";
import {loadUserRequest} from "../../client/user";
import {Peaker} from "../../redux/slices/userSlice";
import {submitNote} from "../utils/noteUtil";
import {sendMessageToUser, sendSuccessfulSyncMessage} from "../utils/messageUtil";
import {injectContentScriptOpenDrawer} from "../utils/generalUtil";
import {loadTags} from "../utils/tagUtil";
import {setItemInChromeState} from "../utils/storageUtils";

// TODO CHANGE THIS <-------
// var userId: string = "108703174669232421421";
var userId: string = "";

// --------------------------------
// Fetch User Auth Token
// --------------------------------
chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
    }
    console.log(`Token: ${token}`)

    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`).then(r => {
        const chrome_user: ChromeUser = r.data as ChromeUser;
        console.log(chrome_user)
        loadUserRequest(chrome_user.id)
            .then(r => {
                const user: Peaker = r.data.data as Peaker;
                console.log(user)
                console.log(`Syncing user: ${chrome_user} to chrome storage`)
                setItemInChromeState("user", user)
                userId = user.id

                loadTags(chrome_user.id)
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
            injectContentScriptOpenDrawer(userId)
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
            submitNote(
                submitNodeMessage.userId,
                submitNodeMessage.selectedTags,
                submitNodeMessage.pageTitle,
                submitNodeMessage.favIconUrl,
                submitNodeMessage.body,
                submitNodeMessage.pageUrl
            ).then(res => {
                sendSuccessfulSyncMessage(submitNodeMessage)
            }).catch(err => {
                console.log(`I HAVE TO FUCKING CATCH?!??!`)
                sendMessageToUser(submitNodeMessage.tabId, "error", "Failed to save your note. Tell Devon.")
            })
    }
});
