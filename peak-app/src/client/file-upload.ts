import peakAxiosClient from "./axiosConfig";
import {useUploadToken} from "./tokens";

export const useUploadFile = () => {
    const token = useUploadToken()

    return (url, file) => token.then(accessToken => {
        return peakAxiosClient.post(url, file, {
            headers: {
                'content-type': file.type,
                'Authorization': `Bearer ${accessToken.token}`
            }
        })
    })
}
