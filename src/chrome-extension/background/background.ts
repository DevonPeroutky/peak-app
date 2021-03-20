import {ChromeExtMessage, MessageType, SubmitNoteMessage} from "../constants/models";
import {submitNote} from "./utils/noteUtil";
import {sendMessageToUser, sendSuccessfulSyncMessage} from "./utils/messageUtil";
import {injectContentScriptOpenDrawer} from "./utils/contentUtils";
import {deleteItem} from "../utils/storageUtils";
import {ACTIVE_TAB_KEY} from "../constants/constants";
import {sleep} from "../utils/generalUtil";
import {logUserIn} from "./utils/authUtil";

// Do we want to do this????
chrome.storage.sync.clear()

// -------------------------------------
// Log user in and Fetch User Auth Token
// -------------------------------------
logUserIn((user) => console.log(`Successfully logged in user: `, user))

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
            const submitNodeMessage = request as SubmitNoteMessage;
            const { userId, selectedTags, pageTitle, favIconUrl, body, pageUrl } = submitNodeMessage
            submitNote(userId, selectedTags, pageTitle, favIconUrl, body, pageUrl)
                .then(res => {
                    const createdNote = res.data
                    sleep(1000).then(() => sendSuccessfulSyncMessage(submitNodeMessage, createdNote.id))
                }).catch(err => {
                    sleep(500)
                        .then(() =>
                            sendMessageToUser(
                                submitNodeMessage.tabId,
                                "error",
                                "Failed to save your bookmark",
                                "Server timed out. Tell Devon."
                            ))
            })
    }
});

// -------------------------------------------
// Listen for tabs refreshing
// -------------------------------------------
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    deleteItem([ACTIVE_TAB_KEY, tabId.toString()] )
});
