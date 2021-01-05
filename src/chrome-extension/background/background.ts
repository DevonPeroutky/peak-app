import axios from 'axios';
import {ChromeExtMessage, ChromeUser, MessageType, SavePageMessage, SubmitNoteMessage} from "../constants/models";
import {loadUserRequest} from "../../client/user";
import {Peaker} from "../../redux/slices/userSlice";
import {resetState, saveToWiki} from "../utils/generalUtil";
import {submitNote} from "../utils/noteUtil";
import {sendMessageToUser} from "../utils/messageUtil";

// TODO CHANGE THIS <-------
var userId: string = "108703174669232421421";
// var userId: string = "";

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
        loadUserRequest(chrome_user.id).then(r => {
            const user: Peaker = r.data.data as Peaker;
            console.log(user)
            console.log(`Syncing user: ${chrome_user} to chrome storage`)
            chrome.storage.sync.set({ user: user });
            userId = user.id
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
    console.log(`Command: ${command}`);
    switch (command) {
        case "save-page":
            saveToWiki(userId)
            break;
        default:
            console.log(`Command: ${command} ???`);
    }
});

// --------------------------------
// Startup
// --------------------------------
chrome.storage.sync.get("user", function (obj) {
    console.log(obj);
    console.log(`The user: ${obj.user.id}`);
    resetState()
});
chrome.commands.getAll(console.log);


// --------------------------------
// Messages
// --------------------------------
chrome.runtime.onMessage.addListener(function(request: ChromeExtMessage, sender, sendResponse) {
    console.log(`Received Message: ${request.message_type}`);
    switch (request.message_type) {
        case MessageType.PostFromBackgroundScript:
            console.log(`POSTing to the backend!`)
            console.log(request)
            const submitNodeMessage: SubmitNoteMessage = request as SubmitNoteMessage;
            submitNote(
                submitNodeMessage.userId,
                submitNodeMessage.selectedTags,
                submitNodeMessage.pageTitle,
                submitNodeMessage.favIconUrl,
                submitNodeMessage.body,
                submitNodeMessage.pageUrl
            ).then(res => {
                // TODO: IF THIS WORKS --> Remove the closeDrawer message
                console.log(`SENDING A VALID RESPONSE!!!`)
                // HOW TO SEND THIS ASYNC??
                sendResponse({ closeDrawer: submitNodeMessage.tabId })
            }).catch(err => {
                sendMessageToUser(submitNodeMessage.tabId, "Failed to save your note. Tell Devon.")
            })
            break;
    }
});
