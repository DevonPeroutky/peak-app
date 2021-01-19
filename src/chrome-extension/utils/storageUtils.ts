import {PeakTag} from "../../redux/slices/tagSlice";
import { uniqBy } from "ramda";

const TAGS_KEY = "tags"

export const addTagsToState = (tags: PeakTag[], callbackFunc: () => void) => {
    console.log(`Adding tags`)
    console.log(tags)
    chrome.storage.sync.get(TAGS_KEY, (data) => {
        const existing_tags: PeakTag[] = data[TAGS_KEY] || []
        console.log("Existing Tags")
        console.log(existing_tags)
        const new_tags = uniqBy(t => t.id, existing_tags.concat(tags))

        console.log(`INSERTING TAGS`)
        console.log(new_tags)
        chrome.storage.sync.set({ [TAGS_KEY]: new_tags }, () => {
            // sendOpenSavePageDrawerMessage(activeTab, userId, tags)
            callbackFunc()
        })
    })
}

export const getItemFromChromeState = (key: string[]) => {
}