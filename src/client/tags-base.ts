import peakAxiosClient from "./axiosConfig";
import {PeakTag} from "../types";
import {STUB_TAG_ID} from "../redux/slices/tags/types";
import {AxiosResponse} from "axios";

export function loadTagsRequests(userId: string) {
    return peakAxiosClient.get(`/api/v1/users/${userId}/tags`)
}
export function deleteTagRequest(userId: string, tagId: string) {
    return peakAxiosClient.delete(`/api/v1/users/${userId}/tags/${tagId}`)
}
export function createTagsRequest(userId: string, tags: PeakTag[]): Promise<PeakTag[]> {
    return peakAxiosClient.post<{tags: PeakTag[]}>(`/api/v1/users/${userId}/tags`, {
        "tags": tags
    }).then(res => res.data.tags)
}

export function futureCreatePeakTags(userId: string, selectedTags: PeakTag[]): Promise<PeakTag[]> {
    const tagsToBeCreated: PeakTag[] = selectedTags.filter(t => t.id === STUB_TAG_ID)
    if (tagsToBeCreated.length > 0) {
        return createTagsRequest(userId, tagsToBeCreated)
    }
    return new Promise(function(resolve, reject) {
        resolve([]);
    });
}
