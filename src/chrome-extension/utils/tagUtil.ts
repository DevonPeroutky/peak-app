import {loadTagsRequests} from "../../client/tags";
import {PeakTag} from "../../redux/slices/tagSlice";
import {AxiosResponse} from "axios";

export function loadTags(userId: string): Promise<PeakTag[]> {
    return loadTagsRequests(userId).then(res => {
        return res.data.tags
    })
}
