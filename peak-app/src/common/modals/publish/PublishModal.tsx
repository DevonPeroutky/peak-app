import React, { useState } from 'react';
import {Button, Modal} from "antd";
import {ShareAltOutlined} from "@ant-design/icons/lib";
import cn from 'classnames';
import {PublishPostForm} from "./publish-post-form/PublishPostForm";
import "./publish-modal.scss"

export const PublishModal = (props: { className?: string }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)

    return (
        <>
            <Button
                className={cn("publish-button", props.className)}
                type="primary"
                shape="round"
                icon={<ShareAltOutlined />}
                onClick={() => setVisible(true)}
                size={"large"}>
                Publish
            </Button>
            <Modal
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                maskClosable={false}
                keyboard={true}
                className="peak-publish-modal"
                maskStyle={{
                    backgroundColor: '#FFF'
                }}
                cancelButtonProps={{
                    shape: "round",
                    size: "large",
                }}
                okText={"Publish"}
                okButtonProps={{
                    shape: "round",
                    size: "large",
                    icon: <ShareAltOutlined/>,
                    loading: loading,
                }}
            >
                <PublishPostForm/>
            </Modal>
        </>
    )
}