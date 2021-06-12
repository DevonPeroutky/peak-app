import {AxiosResponse} from "axios";
import peakAxiosClient from "./axiosConfig";
import {PeakAccessToken, useUploadToken} from "./tokens";
import {useCurrentUser} from "../utils/hooks";

// https://storage.googleapis.com/upload/storage/v1/b/peak_user_images/o?uploadType=media&name=user-id/mount_tam.jpeg
// const dataUri: string = '@/Users/devonperoutky/Downloads/OFfAcpNVZlXYEroTG80JWIkg7c7f-z_n4SDc3AAsM8w.jpg'
export const uploadFileRequest = (userId: string, filename: string, fileType: string, dataUrl: string, accessToken: string): Promise<AxiosResponse<{publicUrl: string}>> => {
    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com/upload/storage/v1/b/"
    const contentType = `image/${fileType}`
    return peakAxiosClient
      .post(`${baseUrl}${bucketName}/o?uploadType=media&name=${userId}/${filename}.${fileType}`, {
        headers: {
            'content-type': contentType,
            'Authorization': `Bearer ${accessToken}`
        },
      })
}

export const useUploadFileRequest = () => (filename: string, fileType: string, dataUrl: string): Promise<AxiosResponse<{publicUrl: string}>> => {
    const uploadImageToken: Promise<PeakAccessToken> = useUploadToken()
    const currentUser = useCurrentUser()

    return uploadImageToken.then(uploadImageToken => {
        return uploadFileRequest(currentUser.id, filename, fileType, dataUrl, uploadImageToken.token)
    })
}
