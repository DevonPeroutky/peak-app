import { AxiosResponse } from "axios"
import peakAxiosClient from "./axiosConfig";

export interface PeakAccessToken {
    token_type: string
    token: string
    expires: number
}

export const fetch_tokens = (userId: string): Promise<AxiosResponse<PeakAccessToken>> => {
    return peakAxiosClient.get<PeakAccessToken>(`/api/v1/users/${userId}/fetch-image-upload-access-token`)
}

