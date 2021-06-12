import peakAxiosClient from "./axiosConfig";
import {useUploadToken} from "./tokens";

export const useUploadFile = () => {
    const fetchToken = useUploadToken()

    return (url, file) => fetchToken().then(accessToken => {
        return peakAxiosClient.post(url, file, {
            headers: {
                'content-type': file.type,
                'Authorization': `Bearer ${accessToken.token}`
            }
        })
    })
}
