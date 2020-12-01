import { PeakHierarchy } from "../redux/userSlice";
import axios from "axios";
import {Node} from "slate";
import {backend_host_address} from "../constants/constants";
import {addTags, deleteTag, PeakTag, setTags, STUB_TAG_ID} from "../redux/tagSlice";
import {store, persistor} from "../redux/store";
import {useSelector} from "react-redux";
import {AppState} from "../redux";


// Page
interface PeakPageParams {
    topicId?: string
    title?: string
    body?: Node[]
}
export function updatePage(userId: string, pageId: string, updatedPageParams: PeakPageParams, hierarchy: PeakHierarchy) {
    return axios.put(`${backend_host_address}/api/v1/users/${userId}/pages/${pageId}`, {
        "page": updatedPageParams,
        "hierarchy": hierarchy
    })
}

// Tags
function deleteTagRequest(userId: string, tagId: string) {
    return axios.delete(`${backend_host_address}/api/v1/users/${userId}/tags/${tagId}`)
}
function createTagsRequest(userId: string, tags: PeakTag[]) {
    return axios.post(`${backend_host_address}/api/v1/users/${userId}/tags`, {
        "tags": tags
    })
}
function loadTagsRequests(userId: string) {
    return axios.get(`${backend_host_address}/api/v1/users/${userId}/tags`)
}

export function createPeakTags(userId: string, tags: PeakTag[]): Promise<PeakTag[]> {
    const tagsToBeCreated: PeakTag[] = tags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated).then(res => {
            const created_tags: PeakTag[] = res.data.tags as PeakTag[]
            store.dispatch(addTags(created_tags))
            console.log(created_tags)
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
export function deletePeakTag(userId: string, tag: PeakTag): Promise<boolean> {
    if (tag.id === STUB_TAG_ID) {
        return new Promise(function(resolve, reject) {
            resolve(true);
        });
    } else {
        return deleteTagRequest(userId, tag.id).then(res => {
            store.dispatch(deleteTag(tag.id))
            return true
        }).catch(err => {
            console.log(`DID NOT successfully delete the tag: ${tag.id}`)
            console.log(err)
            return false
        })
    }

}
export function loadPeakTags(userId: string) {
    return loadTagsRequests(userId).then(res => {
        const tags: PeakTag[] = res.data.tags as PeakTag[]
        store.dispatch(setTags(tags))
    }).catch(err => {
        console.log(`DID NOT successfully load the tags for user: ${userId}`)
        console.log(err)
    })
}
export function useTags() {
    return useSelector<AppState, PeakTag[]>(state => state.tags);
}