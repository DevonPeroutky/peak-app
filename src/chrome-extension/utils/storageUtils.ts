
export const setItemInChromeState = (key: string, value, callbackFunc: () => void = () => console.log(`Set the State.`)) => {
    chrome.storage.sync.set({ [key]: value }, callbackFunc)
}

export const getItemFromChromeState = (key: string, callack) => {
    return chrome.storage.sync.get(key, callack)
}


