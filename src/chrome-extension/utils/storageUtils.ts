

const debugLogState = () => {
    chrome.storage.sync.get(null, (data) => {
        console.log(`Current State is now: `, data)
    })
}
export const setItemInChromeState = (key: string, value, callbackFunc: () => void = debugLogState ) => {
    chrome.storage.sync.set({ [key]: value }, callbackFunc)
}

export const getItemFromChromeState = (key: string, callack) => {
    return chrome.storage.sync.get(key, callack)
}
