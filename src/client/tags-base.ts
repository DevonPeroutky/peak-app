import peakAxiosClient from "./axiosConfig";
import {PeakTag} from "../types";
import {STUB_TAG_ID} from "../redux/slices/tags/types";

export function loadTagsRequests(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/tags`)
}
export function deleteTagRequest(userId: string, tagId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${tagId}`)
}
export function createTagsRequest(userId: string, tags: PeakTag[]) {
    return peakAxiosClient.post(`/api/v1/users/${userId}/tags`, {
        "tags": tags
    })
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
