import React, {useEffect, useState} from 'react';
import {Button, Modal, Spin} from "antd";
import {CloseOutlined, ShareAltOutlined} from "@ant-design/icons/lib";
import cn from 'classnames';
import {PublishPostForm} from "./publish-post-form/PublishPostForm";
import "./publish-modal.scss"
import {useCurrentPage, useCurrentUser} from "../../../utils/hooks";
import {PeakWikiPage} from "../../../constants/wiki-types";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useBlog} from "../../../redux/slices/blog/hooks";
import {useActiveEditorState} from "../../../redux/slices/activeEditor/activeEditorSlice";
import {PublishSuccess} from "./publish-result/PublishSuccess";
import {useDispatch} from "react-redux";
import { deletePage } from 'src/redux/slices/wikiPageSlice';
import { useHistory } from 'react-router-dom';
import { removePageFromTopic } from 'src/redux/slices/topicSlice';

type PUBLISHING_STATE = "publishing" | "publish" | "published"
export const PublishModal = (props: { className?: string }) => {
    const currentPage = useCurrentPage()
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
                closeIcon={(loadingState === "published") ? <CustomCloseIcon currentPageId={currentPage.id}/> : <CloseOutlined/> }
                className="peak-publish-modal"
                maskStyle={{
                    backgroundColor: '#FFF'
                }}
                footer={null}
            >
                <div className="publish-post-container">
                    <Spin spinning={loadingState === "publishing"}>
                        <PublishFormBody loadingState={loadingState} setLoading={setLoading}/>
                    </Spin>
                </div>
            </Modal>
        </>
    )
}

const CustomCloseIcon = (props: { currentPageId: string }) => {
    const history = useHistory()
    const dispatch = useDispatch()

    return (
        <CloseOutlined onClick={() => {
            dispatch(deletePage({ pageId: props.currentPageId }))
            dispatch(removePageFromTopic({ pageId: props.currentPageId }))
            history.push("/home/scratchpad")
        }}/>
    )
}

const PublishFormBody = (props: { loadingState: PUBLISHING_STATE, setLoading: any }) => {
    const { loadingState, setLoading } = props
    const wikiPage: PeakWikiPage = useCurrentPage()
    const user = useCurrentUser()
    const blog: BlogConfiguration = useBlog()
    const [postUrl, setPostUrl] = useState<string>(null)

    switch (loadingState) {
        case "publish":
        case "publishing":
            return <PublishPostForm page={wikiPage} userId={user.id} blogConfiguration={blog} setLoading={setLoading} setUrl={setPostUrl}/>
        case "published":
            return <PublishSuccess postUrl={postUrl}/>
    }
}
