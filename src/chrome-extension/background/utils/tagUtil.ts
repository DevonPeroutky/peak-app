import { setItemInChromeState} from "../../utils/storageUtils";
import {PeakTag} from "../../../types";
import {loadTagsRequests} from "../../../client/tags-base";
import {uniqBy} from "ramda";
import {TAGS_KEY} from "../../constants/constants";

export function loadTags(userId: string): Promise<PeakTag[]> {
    return loadTagsRequests(userId).then(res => {
        const tagsToAdd: PeakTag[] = res.data.tags
        addTagsToState(tagsToAdd, () => console.log(`Successfully added tags to State`))
        return tagsToAdd
    })
}

const addTagsToState = (tags: PeakTag[], callbackFunc: () => void) => {
    chrome.storage.sync.get(TAGS_KEY, (data) => {
        const existing_tags: PeakTag[] = data[TAGS_KEY] || []
        const new_tags = uniqBy(t => t.id, existing_tags.concat(tags))
        setItemInChromeState(TAGS_KEY, new_tags, callbackFunc)
    })
}

