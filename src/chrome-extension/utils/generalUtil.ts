import {sendMessageToUser, sendOpenSavePageDrawerMessage} from "./messageUtil";
import {loadTags} from "./tagUtil";
import {message} from "antd";

type Tab = chrome.tabs.Tab;
export const onActiveTab = (callback: (t: Tab) => any) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        const activeTab = tabs[0];

        if (activeTab) {
            console.log(activeTab)
            return callback(activeTab)
        } else {
            console.log(`No active tab?`)
        }
    })
}

// --------------------------------
// Save Page to Personal Wiki
// --------------------------------
export function saveToWiki(userId: string) {
    console.log(`Saving to wiki!`);

    // Needs to be done in background script so the origin is the chrome extension and not the page we are on.
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
        const activeTab: Tab = tabs[0];
        loadTags(userId).then(tags => {
            console.log(`THE TAG RESPONSE`)
            console.log(tags)
            chrome.storage.sync.set({ "tags": tags}, () => {
                console.log(`DID IT SETTTTT??!?!?!?`)
                sendOpenSavePageDrawerMessage(activeTab, userId, tags)
            })
        }).catch(err => {
            sendMessageToUser(activeTab.id, "Failed to load your tags. Tell Devon.")
        });
    })
};


export function resetState() {
    chrome.storage.sync.clear(() => console.log(`Reset the state`))
}

