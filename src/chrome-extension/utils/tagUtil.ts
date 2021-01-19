import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";
import {addTagsToState} from "./storageUtils";
import {sendOpenSavePageDrawerMessage} from "./messageUtil";

// export function fetchTags(userId: string): Promise<PeakTag[]> {
//     return loadTagsRequests(userId).then(res => {
//         return res.data.tags
//     })
// }

export function loadTags(userId: string): Promise<PeakTag[]> {
    return loadTagsRequests(userId).then(res => {
        const tagsToAdd: PeakTag[] = res.data.tags
        addTagsToState(tagsToAdd, () => console.log(`Successfully added tags to State`))
        return tagsToAdd
    })
}
