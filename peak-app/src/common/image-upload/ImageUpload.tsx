import React, {useCallback, useState} from 'react';
import {Button, notification, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons/lib";
import {PeakAccessToken, useUploadToken} from "../../client/tokens";
import {useCurrentUser} from "../../utils/hooks";
import peakAxiosClient from "../../client/axiosConfig";

export const ImageUpload = (props: {}) => {
    const currentUser = useCurrentUser()
    const [accessToken, setAccessToken] = useState<PeakAccessToken>()
    const [ loading, setLoading ] = useState<boolean>(false)
    useUploadToken().then(token => setAccessToken(token))

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com/upload/storage/v1/b/"

    // `${baseUrl}${bucketName}/o?uploadType=media&name=${userId}/${filename}.${fileType}`
    const uploadProps = (!accessToken) ? { disabled: true } : {
        action: (file) => {
            return Promise.resolve(`${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`)
        },
        headers: {
            'Authorization': `Bearer ${accessToken.token}`
        },
        customRequest: (fileWrapper) => {
            const file = fileWrapper.file
            setLoading(true)
            peakAxiosClient.post(fileWrapper.action, file, {
                headers: {
                    'content-type': file.type,
                    'Authorization': `Bearer ${accessToken.token}`
                }
            }).catch(_ => {
                notification.error({message: `File upload failed`});
            }).finally(() => setLoading(false))
        },
        onChange(info) {
            console.log(`CHANGING `, info)
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                notification.success({message: `File uploaded successfully`});
                setLoading(false)
            } else if (info.file.status === 'error') {
                notification.error({message: `File upload failed`});
                setLoading(false)
            }
        },
    };

    console.log(`Access Token: `, accessToken)
    console.log(`The Props: `, uploadProps)

    return (
        <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={loading}>Click to Upload</Button>
        </Upload>
    )
}