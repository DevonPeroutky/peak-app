import peakAxiosClient from "./axiosConfig";
import {AxiosResponse} from "axios";
import {LinkMetaData} from "../common/rich-text-editor/plugins/peak-media-embed-plugin/types";

export const fetchLinkMetadata = (userId: string, url: string): Promise<AxiosResponse<LinkMetaData>> => {
    return peakAxiosClient.post<LinkMetaData>(`/api/v1/users/${userId}/fetch-link-metadata`,
        {
            url: url
        }
    )
}