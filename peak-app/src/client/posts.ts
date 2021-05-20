import {AxiosResponse} from "axios";
import peakAxiosClient from "./axiosConfig";
import {PeakPost} from "../redux/slices/posts/types";

export const createPeakPostRequest = (userId: string, subdomain: string, post_payload: PeakPost): Promise<AxiosResponse<PeakPost>> => {
    return peakAxiosClient.post<PeakPost>(`/api/v1/users/${userId}/blog/${subdomain}/post`, { post: post_payload })
}
