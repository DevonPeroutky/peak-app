import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Upload} from "antd";
import {LoadingOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {PeakAccessToken, useUploadToken} from "../../client/tokens";
import {useCurrentUser} from "../../utils/hooks";
import peakAxiosClient from "../../client/axiosConfig";
import {useUploadFile} from "../../client/file-upload";

export const ImageUpload = (props: {}) => {
    const currentUser = useCurrentUser()
    const [loading, setLoading] = useState<boolean>(false)
    const [entropy, setEntropy] = useState<number>(Date.now())
    const [imageUrl, setImageUrl] = useState<string | undefined>()
    const uploadRequest = useUploadFile()

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com"

    const uploadProps = {
        action: (file) => {
            setEntropy(Date.now())
            return Promise.resolve(`${baseUrl}/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${currentUser.id}/${entropy}-${file.name}`)
        },
        accept: "image/*",
        customRequest: (fileWrapper) => {
            const file = fileWrapper.file
            setLoading(true)

            uploadRequest(fileWrapper.action, file).then(res => {
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
        <Upload {...uploadProps} listType={'picture-card'} showUploadList={false}>
            { (imageUrl) ? <img src={imageUrl} alt="avatar" style={{ maxWidth: '100%', maxHeight: 256, width: "auto" }} /> :
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            }
        </Upload>
    )
}