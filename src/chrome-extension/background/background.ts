import axios from 'axios';
import {sendCurrentPageToReadingListMessage, onActiveTab} from "../utils/messageUtil";
import {popOffPage, saveToWiki} from "../utils/tabUtils";
import {ChromeUser} from "../utils/constants/models";
import {loadUserRequest} from "../../client/user";
const R = require('ramda');

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
        loadUserRequest(chrome_user.id).then(r => {
            const chrome_user= r.data.data.id;
            chrome.storage.sync.set({user: r.data.data});
            userId = chrome_user
        })

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
        case "add-to-reading-list":
            onActiveTab(R.partial(sendCurrentPageToReadingListMessage, [userId]));
            break;
        case "pop-from-reading-list":
            popOffPage(userId)
            break;
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
    // console.log(`LOADING user on startup?`);
    console.log(obj);
    // console.log(`The user: ${obj.user.id}`);
    // if (obj.id)
    // const saveToUserReadingList = R.partial(saveToReadingList, [obj.user.id]);
    // chrome.contextMenus.onClicked.addListener(saveToUserReadingList);
});
chrome.commands.getAll(console.log);