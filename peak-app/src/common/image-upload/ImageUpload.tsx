import React, {useState} from 'react';
import {Button, notification, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons/lib";
import {PeakAccessToken, useUploadToken} from "../../client/tokens";
import {useCurrentUser} from "../../utils/hooks";
import peakAxiosClient from "../../client/axiosConfig";

export const ImageUpload = (props: {}) => {
    const currentUser = useCurrentUser()
    const [contentType, setContentType] = useState<string>("")
    const [accessToken, setAccessToken] = useState<PeakAccessToken>()
    const [imageData, setImageData] = useState()
    useUploadToken().then(token => setAccessToken(token))

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com/upload/storage/v1/b/"
    const allowableFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    // `${baseUrl}${bucketName}/o?uploadType=media&name=${userId}/${filename}.${fileType}`
    const uploadProps = (!accessToken) ? { disabled: true } : {
        name: 'file',
        action: (file) => {
            return Promise.resolve(`${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`)
        },
        beforeUpload: file => {
            console.log(`The File `, file)
            const validFile = allowableFileTypes.find(f => f === file.type)
            if (!validFile) {
                notification.error({ message: `Only jpeg, jpg, png, and svg are allowed` });
                // @ts-ignore
                return Upload.LIST_IGNORE;
            }
            setContentType(file.type)
            return true
        },
        headers: {
            'Content-Type': contentType,
            'Authorization': `Bearer ${accessToken.token}`
        },
        // customRequest: (file) => {
        //     console.log(`THE FILE `, file)
        //     console.log(`THE FILE DATA `, imageData)
        //     return peakAxiosClient
        //         .post(`${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`, {
        //             headers: {
        //                 'content-type': file.type,
        //                 'Authorization': `Bearer ${accessToken}`
        //             },
        //             data: imageData
        //         })
        //
        // },
        onChange(info) {
            console.log(`Info: `, info)

            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                notification.success({ message: `${info.file.name} file uploaded successfully`});
            } else if (info.file.status === 'error') {
                notification.error({ message: `${info.file.name} file upload failed.`});
            }

            getBase64(info.file.originFileObj, imageUrl => {
                console.log(`WTF `, imageUrl)
                setImageData(imageUrl)
            });
        },
    };

    console.log(`Access Token: `, accessToken)
    console.log(`The Props: `, uploadProps)
    return (
        <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    )
}