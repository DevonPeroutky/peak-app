import React, {useCallback, useEffect, useState} from 'react';
import {notification, Upload} from "antd";
import {EditOutlined, LoadingOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {useCurrentUser} from "../../utils/hooks";
import {useUploadFile} from "../../client/file-upload";
import "./image-upload.scss"

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
                setImageUrl(`${baseUrl}/${bucketName}/${currentUser.id}/${entropy}-${file.name}`)
            })
            .catch(_ => {
                notification.error({message: `File upload failed`});
            }).finally(() => setLoading(false))
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(`Uploading `, info)
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

    const imagePreview = (
        <>
            <img src={imageUrl} alt="avatar" style={{ maxWidth: '100%', maxHeight: 256, width: "auto" }} />
            <EditOutlined style={{ position: "relative", top: 0, right: 0}}/>
        </>
    )

    const upload = (
        <Upload {...uploadProps} listType={'picture-card'} showUploadList={false}>
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>{ loading ? "Uploading" : "Upload" }</div>
            </div>
        </Upload>

    )

    return (
        <div className={"upload-container"}>
            { (imageUrl) ? imagePreview : upload }
        </div>
    )
}