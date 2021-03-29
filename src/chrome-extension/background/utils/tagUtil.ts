import {getItem, setItem} from "../../utils/storageUtils";
import {PeakTag} from "../../../types";
import {futureCreatePeakTags, loadTagsRequests} from "../../../client/tags-base";
import {uniqBy} from "ramda";
import {TAGS_KEY} from "../../constants/constants";

export function loadTagsFromBackend(userId: string): Promise<PeakTag[]> {
    return loadTagsRequests(userId).then(res => {
        const tagsToAdd: PeakTag[] = res.data.tags
        // addTagsToState(tagsToAdd, () => console.log(`Successfully added tags to State`))
        setItem(TAGS_KEY, tagsToAdd, () => console.log(`Successfully added tags to State`))
        return tagsToAdd
    })
}

// IF we get a successful response from the backend, always use it.
const addTagsToState = (tags: PeakTag[], callbackFunc: () => void) => {
    getItem(TAGS_KEY, (data) => {
        const existing_tags: PeakTag[] = data[TAGS_KEY] || []
        const new_tags = uniqBy(t => t.id, existing_tags.concat(tags))
        setItem(TAGS_KEY, new_tags, callbackFunc)
    })
}

export function createPeakTags(userId, tags: PeakTag[]) {
    return futureCreatePeakTags(userId, tags).then(tags => {
        addTagsToState(tags, () => console.log(`Successfully added tags to State`))
        return tags
    })
}