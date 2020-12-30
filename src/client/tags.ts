import peakAxiosClient from "./axiosConfig";
import {addTags, deleteTag, PeakTag, setTags, STUB_TAG_ID} from "../redux/slices/tagSlice";
import {store} from "../redux/store";
import {useSelector} from "react-redux";
import {AppState} from "../redux";

function deleteTagRequest(userId: string, tagId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${tagId}`)
}
function createTagsRequest(userId: string, tags: PeakTag[]) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/tags`, {
        "tags": tags
    })
}
export function loadTagsRequests(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/tags`)
}

export function futureCreatePeakTags(userId: string, selectedTags: PeakTag[]) {
    const tagsToBeCreated: PeakTag[] = selectedTags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated)
    }
    return new Promise(function(resolve, reject) {
        resolve([]);
    });
}

export function createPeakTags(userId: string, tags: PeakTag[]): Promise<PeakTag[]> {
    console.log(`ACTUAlLY CREATING THE TAGS`)
    const tagsToBeCreated: PeakTag[] = tags.filter(t => t.id === STUB_TAG_ID)
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
