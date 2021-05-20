import React, { useState } from 'react';
import {Button, Modal} from "antd";
import {ShareAltOutlined} from "@ant-design/icons/lib";
import cn from 'classnames';
import {PublishPostForm} from "./publish-post-form/PublishPostForm";
import "./publish-modal.scss"
import {useCurrentPage, useCurrentUser} from "../../../utils/hooks";
import {PeakWikiPage} from "../../../constants/wiki-types";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useBlog} from "../../../redux/slices/blog/hooks";

export const PublishModal = (props: { className?: string }) => {
    const [visible, setVisible] = useState(false);
    const wikiPage: PeakWikiPage = useCurrentPage()
    const user = useCurrentUser()
    const blog: BlogConfiguration = useBlog()

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
                footer={null}
            >
                <PublishPostForm page={wikiPage} userId={user.id} blogConfiguration={blog}/>
            </Modal>
        </>
    )
}