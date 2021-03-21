import {ChromeExtMessage, DeletePageMessage, MessageType, SubmitNoteMessage} from "../constants/models";
import {submitNote} from "./utils/noteUtil";
import {
    sendMessageToUser,
    sendSuccessfulDeleteMessage,
    sendSuccessfulSyncMessage,
    sendUnauthedMessageToUser
} from "./utils/messageUtil";
import {openDrawer} from "./utils/contentUtils";
import {deleteItem} from "../utils/storageUtils";
import {ACTIVE_TAB_KEY} from "../constants/constants";
import {sleep} from "../utils/generalUtil";
import {logUserIn} from "./utils/authUtil";
import {deleteNoteRequest} from "../../client/webNotes";

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
            openDrawer()
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
            submitNote(userId, selectedTags, pageTitle, favIconUrl, body, pageUrl).then(res => {
                const createdNote = res.data.book
                console.log(res)
                sleep(1000).then(() => sendSuccessfulSyncMessage(submitNodeMessage, createdNote.id))
            }).catch(err => {
                sleep(500)
                    .then(() => {
                        if (err.response.status === 401) {
                            sendUnauthedMessageToUser(submitNodeMessage.tabId)
                        } else {
                            sendMessageToUser(
                                submitNodeMessage.tabId,
                                "error",
                                "Failed to save your bookmark",
                                "Server timed out. Tell Devon."
                            )
                        }
                    })
            })
            break
        case MessageType.DeleteFromBackgroundScript:
            const deletePageMessage = request as DeletePageMessage
            const { noteId } = deletePageMessage
            deleteNoteRequest(deletePageMessage.userId, noteId).then(res => {
                sleep(500).then(_ => sendSuccessfulDeleteMessage(deletePageMessage))
            })
            break
    }
});

// -------------------------------------------
// Listen for tabs refreshing
// -------------------------------------------
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    deleteItem([ACTIVE_TAB_KEY, tabId.toString()] )
});
