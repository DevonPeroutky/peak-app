import peakAxiosClient from "./axiosConfig";
import {AxiosResponse} from "axios";
import {LinkMetaData} from "component-library";

export const fetchLinkMetadata = (userId: string, url: string): Promise<AxiosResponse<LinkMetaData>> => {
    return peakAxiosClient.post<LinkMetaData>(`/api/v1/users/${userId}/fetch-link-metadata`,
        {
            url: url
        }
    )
}