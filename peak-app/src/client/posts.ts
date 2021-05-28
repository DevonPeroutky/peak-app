import {AxiosResponse} from "axios";
import peakAxiosClient from "./axiosConfig";
import {PeakPost} from "component-library";

export const createPeakPostRequest = (userId: string, subdomain: string, post_payload: PeakPost): Promise<PeakPost> => {
    return peakAxiosClient
        .post<{post: PeakPost}>(`/api/v1/users/${userId}/blog/${subdomain}/post`, { post: post_payload })
        .then(res => res.data.post)
}
