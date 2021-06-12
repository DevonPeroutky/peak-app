import React, {useCallback, useState} from 'react';
import {Button, notification, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons/lib";
import {PeakAccessToken, useUploadToken} from "../../client/tokens";
import {useCurrentUser} from "../../utils/hooks";
import peakAxiosClient from "../../client/axiosConfig";
import {sleep} from "../../chrome-extension/utils/generalUtil";

export const ImageUpload = (props: {}) => {
    const currentUser = useCurrentUser()
    const [contentType, setContentType] = useState<string>("")
    const [accessToken, setAccessToken] = useState<PeakAccessToken>()
    const [imageDataUrl, setImageData] = useState()
    useUploadToken().then(token => setAccessToken(token))

    const bucketName = "peak_user_images"
    const baseUrl = "https://storage.googleapis.com/upload/storage/v1/b/"

    function getBinaryString(img, callback) {
        const reader = new FileReader();
        console.log(`Reading in....... `, img)
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsBinaryString(img);
    }
    function getBase64(img, callback) {
        const reader = new FileReader();
        console.log(`Reading in....... `, img)
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    function getText(img, callback) {
        const reader = new FileReader();
        console.log(`Reading in....... `, img)
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsText(img);
    }

    // `${baseUrl}${bucketName}/o?uploadType=media&name=${userId}/${filename}.${fileType}`
    const uploadProps = (!accessToken) ? { disabled: true } : {
        action: (file) => {
            // return Promise.resolve(`${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`)
            return Promise.resolve(`${baseUrl}${bucketName}/o?uploadType=multipart`)
        },
        headers: {
            'Authorization': `Bearer ${accessToken.token}`
        },
        customRequest: (fileWrapper) => {
            const file = fileWrapper.file
            peakAxiosClient
                .post(
                    `${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`,
                   file,
                    {
                        headers: {
                            'content-type': file.type,
                            'Authorization': `Bearer ${accessToken.token}`
                        }
                    })
            // getBase64(file, imageUrl => {
            //     console.log(`Base64: `, imageUrl)
            //     const stripped = imageUrl.substring(23)
            //     console.log(`Base64 - stripped: `, stripped)
            //     peakAxiosClient
            //         .post(
            //             `${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/${file.name}`,
            //             {
            //                 data: stripped
            //             },
            //             {
            //                 headers: {
            //                     'content-type': file.type,
            //                     'Authorization': `Bearer ${accessToken.token}`
            //                 }
            //             })
            // })
            // getBinaryString(file, imageUrl => {
            //     console.log(`BitchyBoyyyy - BINARY: `, imageUrl)
            //     peakAxiosClient
            //         .post(
            //             `${baseUrl}${bucketName}/o?uploadType=media&name=${currentUser.id}/binary-${file.name}`,
            //             {
            //                 data: imageUrl
            //             },
            //             {
            //                 headers: {
            //                     'content-type': file.type,
            //                     'Authorization': `Bearer ${accessToken.token}`
            //                 }
            //             })
            // })
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