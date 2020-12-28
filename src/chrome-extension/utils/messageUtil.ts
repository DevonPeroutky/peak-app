type Tab = chrome.tabs.Tab;
export const onActiveTab = (callback: (t: Tab) => void) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        const activeTab = tabs[0];

        if (activeTab) {
            callback(activeTab)
        } else {
            console.log(`No active tab?`)
        }
    })
}