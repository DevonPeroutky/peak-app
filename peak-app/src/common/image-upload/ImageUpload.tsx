import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Upload} from "antd";
import {LoadingOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {PeakAccessToken, useUploadToken} from "../../client/tokens";
import {useCurrentUser} from "../../utils/hooks";
import peakAxiosClient from "../../client/axiosConfig";

export const ImageUpload = (props: {}) => {
    const currentUser = useCurrentUser()
    const [accessToken, setAccessToken] = useState<PeakAccessToken>()
    const [loading, setLoading] = useState<boolean>(false)
    const [entropy, setEntropy] = useState<number>(Date.now())
    const [imageUrl, setImageUrl] = useState<string | undefined>()

    useUploadToken().then(token => setAccessToken(token))

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com"

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    
    const uploadProps = (!accessToken) ? { disabled: true } : {
        action: (file) => {
            setEntropy(Date.now())
            return Promise.resolve(`${baseUrl}/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${currentUser.id}/${entropy}-${file.name}`)
        },
        headers: {
            'Authorization': `Bearer ${accessToken.token}`
        },
        accept: "image/*",
        customRequest: (fileWrapper) => {
            const file = fileWrapper.file
            setLoading(true)
            peakAxiosClient.post(fileWrapper.action, file, {
                headers: {
                    'content-type': file.type,
                    'Authorization': `Bearer ${accessToken.token}`
                }
            }).then(res => {
                console.log(`Res `, res.data)
                console.log(`THE ENTROPY NOW `, entropy)
                setImageUrl(`${baseUrl}/${bucketName}/${currentUser.id}/${entropy}-${file.name}`)
            })
            .catch(_ => {
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

    return (
        <>
            <Upload {...uploadProps} listType={'picture-card'} showUploadList={false}>
                { (imageUrl) ? <img src={imageUrl} alt="avatar" style={{ maxWidth: '100%', maxHeight: 256, width: "auto" }} /> : uploadButton }
            </Upload>
        </>
    )
}