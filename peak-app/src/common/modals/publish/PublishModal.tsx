import React, { useState } from 'react';
import {Button, Modal, Spin} from "antd";
import {ShareAltOutlined} from "@ant-design/icons/lib";
import cn from 'classnames';
import {PublishPostForm} from "./publish-post-form/PublishPostForm";
import "./publish-modal.scss"
import {useCurrentPage, useCurrentUser} from "../../../utils/hooks";
import {PeakWikiPage} from "../../../constants/wiki-types";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useBlog} from "../../../redux/slices/blog/hooks";
import {useActiveEditorState} from "../../../redux/slices/activeEditor/activeEditorSlice";
import {PublishSuccess} from "./publish-result/PublishSuccess";

type PUBLISHING_STATE = "publishing" | "publish" | "published"
export const PublishModal = (props: { className?: string }) => {
    const editorState = useActiveEditorState()
    const [visible, setVisible] = useState(false);
    const [loadingState, setLoading] = useState<PUBLISHING_STATE>("publish")

    return (
        <>
            <Button
                className={cn("publish-button", props.className)}
                type="primary"
                shape="round"
                disabled={editorState.isSaving}
                icon={<ShareAltOutlined />}
                onClick={() => setVisible(true)}
                size={"large"}>
                Publish
            </Button>
            <Modal
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => {
                    setVisible(false)
                    setLoading("publish")
                }}
                maskClosable={false}
                destroyOnClose={true}
                closable={loadingState !== "publishing"}
                keyboard={true}
                className="peak-publish-modal"
                maskStyle={{
                    backgroundColor: '#FFF'
                }}
                footer={null}
            >
                <div className="publish-post-container">
                    <PublishFormBody loadingState={loadingState} setLoading={setLoading}/>
                </div>
            </Modal>
        </>
    )
}


const PublishFormBody = (props: { loadingState: PUBLISHING_STATE, setLoading: any }) => {
    const { loadingState, setLoading } = props
    const wikiPage: PeakWikiPage = useCurrentPage()
    const user = useCurrentUser()
    const blog: BlogConfiguration = useBlog()
    const [postUrl, setPostUrl] = useState<string>(null)

    console.log(`Post URL: ${postUrl}`)

    switch (loadingState) {
        case "publish":
            // @ts-ignore
            return <PublishPostForm page={wikiPage} userId={user.id} blogConfiguration={blog} setLoading={setLoading} setUrl={setPostUrl}/>
        case "publishing":
            return <Spin className={"animate__animated animate__zoomIn"} style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}/>
        case "published":
            return <PublishSuccess postUrl={postUrl}/>
    }
}
