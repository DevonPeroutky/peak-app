import axios from 'axios';
import {ChromeUser} from "../utils/constants/models";
import {loadUserRequest} from "../../client/user";
import {Peaker} from "../../redux/slices/userSlice";
import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";
import {closeDrawer, openNoteModal} from "../utils/stateUtils";
import {onActiveTab} from "../utils/messageUtil";
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
            openNoteModal(userId)
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
    loadTagsRequests(obj.user.id).then(res => {
        const returned_tags: PeakTag[] = res.data.tags
        chrome.storage.sync.set({ tags: returned_tags})
    })
    closeDrawer()
});
chrome.commands.getAll(console.log);