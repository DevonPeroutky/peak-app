import {useDispatch} from "react-redux";
import { deletePage } from "../../redux/slices/wikiPageSlice";
import {removePageFromTopic, PeakPage} from "../../redux/slices/topicSlice"
import React, {useState} from "react";
import cn from "classnames";
import "./page-context-bar.scss"
import {message, Popconfirm, Switch} from 'antd';
import peakAxiosClient from "../../client/axiosConfig"
import {DeleteOutlined, EditOutlined, QuestionCircleOutlined} from "@ant-design/icons/lib";
import {useHistory} from "react-router-dom";
import { batch } from 'react-redux'
import {useCurrentUser, useCurrentPage, useDetermineNextLink} from "../../utils/hooks";
import {setUserHierarchy} from "../../redux/slices/user/userSlice";
import {PeakTopicNode} from "../../redux/slices/user/types";
import {setEditing, useActiveEditorState} from "../../redux/slices/activeEditor/activeEditorSlice";

const PageContextBar = (props: {topicId: string}) => {
    const { topicId } = props
    let history = useHistory();
    const dispatch = useDispatch()
    const editorState = useActiveEditorState()
    const peakWikiPage = useCurrentPage()
    const determineNextLink = useDetermineNextLink();
    const user = useCurrentUser()

    const contextButton =
        <div className="context-button-row animated fadeIn">
            <Switch className={cn("public-switch")} checkedChildren="Public" unCheckedChildren="Private" defaultChecked/>
            <EditOutlined
                className={cn("is-editing-icon", editorState.isEditing ? "active" : "")}
                onClick={() => {
                    dispatch(setEditing({ isEditing: !editorState.isEditing}))
                }}/>
            <Popconfirm title="Are you sure？" className={cn("is-editing-icon", editorState.isEditing ? "active" : "")} icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => deletePageEverywhere()}>
                <DeleteOutlined />
            </Popconfirm>
        </div>

    const deletePageEverywhere = () => {
        peakAxiosClient.delete(`/api/v1/users/${user.id}/pages/${peakWikiPage.id}?topic_id=${topicId}`).then((res) => {
            message.info("Deleted the page!");
            const newHierarchy: PeakTopicNode[] = res.data.hierarchy
            history.push(determineNextLink(peakWikiPage.id));
            batch(() => {
                dispatch(deletePage({pageId: peakWikiPage.id}));
                dispatch(removePageFromTopic({pageId: peakWikiPage.id}));
                dispatch(setUserHierarchy(newHierarchy));
            })
        })
    };

    return (
        <div className={"context-container"}>
            { (editorState.isEditing) ? null : contextButton }
        </div>
    )
}

export default PageContextBar