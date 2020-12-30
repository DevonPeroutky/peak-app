import peakAxiosClient from "./axiosConfig";
import {PeakDisplayTag} from "../common/rich-text-editor/plugins/peak-knowledge-plugin/components/peak-knowledge-node/peak-tag-select/component/PeakTagSelect";
import {addTags, deleteTag, PeakTag, setTags, STUB_TAG_ID} from "../redux/slices/tagSlice";
import {store} from "../redux/store";
import {useSelector} from "react-redux";
import {AppState} from "../redux";

function deleteTagRequest(userId: string, tagId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${tagId}`)
}
function createTagsRequest(userId: string, tags: PeakDisplayTag[]) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/tags`, {
        "tags": tags
    })
}
export function loadTagsRequests(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/tags`)
}

export function futureCreatePeakTags(userId: string, selectedTags: PeakDisplayTag[]) {
    const tagsToBeCreated: PeakDisplayTag[] = selectedTags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated)
    }
    return new Promise(function(resolve, reject) {
        resolve([]);
    });
}

export function createPeakTags(userId: string, tags: PeakDisplayTag[]): Promise<PeakTag[]> {
    console.log(`ACTUAlLY CREATING THE TAGS`)
    const tagsToBeCreated: PeakDisplayTag[] = tags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated).then(res => {
            const created_tags: PeakTag[] = res.data.tags as PeakTag[]
            store.dispatch(addTags(created_tags))
            return created_tags
        }).catch(err => {
            console.log(`DID NOT successfully create the tags`)
            console.log(err)
            return []
        })
    }
    return new Promise(function(resolve, reject) {
        resolve([]);
    });
}
export function deletePeakTag(userId: string, tagId: string): Promise<string> {
    if (tagId === STUB_TAG_ID) {
        return new Promise(function(resolve, reject) {
            resolve(tagId);
        });
    } else {
        return deleteTagRequest(userId, tagId).then(res => {
            store.dispatch(deleteTag(tagId))
            return tagId
        }).catch(err => {
            console.log(`DID NOT successfully delete the tag: ${tagId}`)
            console.log(err)
            return tagId
        })
    }

}
export function useTags() {
    return useSelector<AppState, PeakTag[]>(state => state.tags);
}
