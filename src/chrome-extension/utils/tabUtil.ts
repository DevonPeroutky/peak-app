import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";
import {MessageType, SavePageMessage} from "../constants/models";

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

    // TODO: MOVE THIS TO CONTENT SIDE OF THINGS
    loadTags(userId).then(res => {
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            const activeTab: Tab = tabs[0];
            sendOpenSavePageDrawerMessage(activeTab, userId)
        });
    })
};

const sendOpenSavePageDrawerMessage = (activeTab: Tab, userId: string) => {
    const message: SavePageMessage = {
        "message_type": MessageType.SaveToPeak,
        "user_id": userId,
        "tab": activeTab
    };
    chrome.tabs.sendMessage(activeTab.id, message);
};

export function resetState() {
    chrome.storage.sync.clear(() => console.log(`Reset the state`))
}

export function loadTags(userId: string) {
    return loadTagsRequests(userId).then(res => {
        const returned_tags: PeakTag[] = res.data.tags
        chrome.storage.sync.set({ tags: returned_tags})
    })
}
