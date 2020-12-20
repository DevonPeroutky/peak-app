import React, { useState } from 'react';
import { message, Popconfirm} from "antd";
import { useDispatch, useSelector} from "react-redux";
import { PeakTopic, deleteTopic} from "../../../redux/topicSlice"
import {AppState} from "../../../redux";
import {Peaker, PeakTopicNode, setUserHierarchy} from "../../../redux/userSlice";
import "./delete-topic-modal.scss";
import {
    DeleteOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons/lib";
import cn from "classnames";
import peakAxiosClient from "../../../client/axiosConfig"
import {useHistory} from "react-router-dom";
import {useCurrentUser} from "../../../utils/hooks";

export const DeleteTopicModal = (props: {topicId: string, hovered: boolean}) => {
    const { topicId, hovered } = props
    const dispatch = useDispatch()
    const history = useHistory()
    const user: Peaker = useCurrentUser()
    const topic: PeakTopic = useSelector<AppState, PeakTopic>(state => state.topics.find(t => t.id === topicId)!);
    const deleteTopicAndAllPages = () => {
        return peakAxiosClient.delete(`/api/v1/users/${user.id}/topics/${topic.id}`).then((res) => {
            const newHierarchy: PeakTopicNode[] = res.data.hierarchy
            dispatch(setUserHierarchy(newHierarchy));
            dispatch(deleteTopic(topic.id))
            message.success("Deleted the topic")
            history.push('/home/journal')
        }).catch(() => {
            message.error("Failed to delete the topic")
        })
    };

    return (
        <Popconfirm
            title="Delete the Topic？This will delete all of the pages in the topic"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteTopicAndAllPages()}>
            <DeleteOutlined
                className={cn("delete-topic-icon", hovered ? "visible" : "")}
            />
        </Popconfirm>
    )
};
