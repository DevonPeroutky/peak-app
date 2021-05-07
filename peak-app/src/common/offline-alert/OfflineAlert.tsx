import React from 'react'
import {useOnlineStatus} from "../../utils/hooks";
import {Alert, Tag, Tooltip} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./offline-alert.scss"

export const OfflineAlert = (props: {}) => {
    const isOnline = useOnlineStatus()
    if (isOnline) {
        return null
    } else {
        return (
            <Tooltip title={"Peak is offline. You can continue to make changes, but be sure to let this instance sync before using another instance of Peak"}>
                <Tag icon={<ExclamationCircleOutlined/>} color="processing" closable={false}>Offline</Tag>
            </Tooltip>
        )
    }
}