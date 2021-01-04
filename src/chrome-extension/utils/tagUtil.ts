import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";

export function loadTags(userId: string) {
    return loadTagsRequests(userId).then(res => {
        const returned_tags: PeakTag[] = res.data.tags
        chrome.storage.sync.set({ tags: returned_tags})
    })
}
