import {addTagsToState} from "./storageUtils";
import {PeakTag} from "../../types";
import {loadTagsRequests} from "../../client/tags-base";

export function loadTags(userId: string): Promise<PeakTag[]> {
    return loadTagsRequests(userId).then(res => {
        const tagsToAdd: PeakTag[] = res.data.tags
        addTagsToState(tagsToAdd, () => console.log(`Successfully added tags to State`))
        return tagsToAdd
    })
}
