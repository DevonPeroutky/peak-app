import { AxiosResponse } from "axios"
import peakAxiosClient from "./axiosConfig";
import {useSelector} from "react-redux";
import {AppState} from "../redux";
import {store} from "../redux/store";
import { addToken } from "src/redux/slices/tokens/tokenSlice";
import {useCurrentUser} from "../utils/hooks";

export interface PeakAccessToken {
    token_type: string
    token: string
    expires: number // This should be in seconds
}

export const fetch_upload_token = (userId: string): Promise<AxiosResponse<PeakAccessToken>> => {
    return peakAxiosClient.get<PeakAccessToken>(`/api/v1/users/${userId}/fetch-image-upload-access-token`)
}

export const refresh_upload_token = (userId: string): Promise<PeakAccessToken> => {
    return fetch_upload_token(userId).then(res => {
        const access_token: PeakAccessToken = res.data
        store.dispatch(addToken(access_token))
        return access_token
    })
}

const useToken = (tokenName: string): PeakAccessToken => {
    return useSelector<AppState, PeakAccessToken>(state => state.tokens.find(t => t.token_type === tokenName));
}

export const useUploadToken = (): Promise<PeakAccessToken> => {
    const token = useToken("file_upload")
    const user = useCurrentUser()
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)

    if (currentTimeInSeconds > token.expires) {
        console.log(`Token has expired`)
        return refresh_upload_token(user.id)
    } else {
        console.log(`Token still valid`)
        return Promise.resolve(token)
    }
}
