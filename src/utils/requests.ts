import { PeakHierarchy } from "../redux/userSlice";
import axios from "axios";
import {Node} from "slate";
import {backend_host_address} from "../constants/constants";
import {addTags, deleteTag, PeakTag, setTags, STUB_TAG_ID} from "../redux/tagSlice";
import {store, persistor} from "../redux/store";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {PeakDisplayTag} from "../common/rich-text-editor/plugins/peak-learning-plugin/component/PeakLearning";


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
function createTagsRequest(userId: string, tags: PeakDisplayTag[]) {
    return axios.post(`${backend_host_address}/api/v1/users/${userId}/tags`, {
        "tags": tags
    })
}
function loadTagsRequests(userId: string) {
    return axios.get(`${backend_host_address}/api/v1/users/${userId}/tags`)
}

export function createPeakTags(userId: string, tags: PeakDisplayTag[]): Promise<PeakTag[]> {
    console.log(`ACTUAlLY CREATING THE TAGS`)
    const tagsToBeCreated: PeakDisplayTag[] = tags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated).then(res => {
            const created_tags: PeakTag[] = res.data.tags as PeakTag[]
            store.dispatch(addTags(created_tags))
            console.log(`RESPONSE`)
            console.log(res)
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