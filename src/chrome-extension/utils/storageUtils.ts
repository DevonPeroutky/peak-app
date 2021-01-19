import {PeakTag} from "../../redux/slices/tagSlice";
import { uniqBy } from "ramda";

export const TAGS_KEY = "tags"

export const addTagsToState = (tags: PeakTag[], callbackFunc: () => void) => {
    chrome.storage.sync.get(TAGS_KEY, (data) => {
        const existing_tags: PeakTag[] = data[TAGS_KEY] || []
        const new_tags = uniqBy(t => t.id, existing_tags.concat(tags))
        setItemInChromeState(TAGS_KEY, new_tags, callbackFunc)
    })
}

export const setItemInChromeState = (key: string, value, callbackFunc: () => void = () => console.log(`Set State.`)) => {
    chrome.storage.sync.set({ [key]: value }, callbackFunc)
}
