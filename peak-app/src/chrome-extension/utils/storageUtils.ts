const debugLogState = () => {
    chrome.storage.sync.get(null, (data) => {
        console.log(`Current State is now: `, data)
    })
}

export const getItemSizeFromChromeState = () => {
    return chrome.storage.sync.getBytesInUse(null, res => {
        console.log(`Bytes In Use `, res)
    })
}

export const getItem = (key: string | string[], callack) => {
    return chrome.storage.sync.get(key, callack)
}

export const setItem = (key: string, value, callbackFunc: () => void = debugLogState ) => {
    chrome.storage.sync.set({ [key]: value }, callbackFunc)
}

export const deleteItem = (key: string | string[], callack?: () => void) => {
    return chrome.storage.sync.remove(key, callack)
}
