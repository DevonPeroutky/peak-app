import React, { useState } from 'react';
import {Button, Modal, Input, Tooltip, message} from "antd";
import {connect, useDispatch, useSelector} from "react-redux";
import {updateTopic, PeakTopic, addTopic} from "../../../redux/slices/topicSlice"
import {AppState} from "../../../redux";
import {Peaker, PeakTopicNode, setUserHierarchy} from "../../../redux/slices/user/userSlice";
import "./update-topic-modal.scss";
import { backend_host_address } from "../../../constants/constants";
import {CompassOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons/lib";
import cn from "classnames";
import peakAxiosConfig from "../../../client/axiosConfig"
import {useCurrentUser} from "../../../utils/hooks";

export const UpdateTopicModal = (props: {topicId: string, hovered: boolean}) => {
    const { topicId, hovered } = props

    const dispatch = useDispatch()
    const user: Peaker = useCurrentUser()
    const topic: PeakTopic = useSelector<AppState, PeakTopic>(state => state.topics.find(t => t.id === topicId)!);
    const [visible, setVisibility] = useState(false);
    const [topicName, setTopicName] = useState(topic.name);
    const [isLoading, setLoading] = useState(false);

    const handleCancel = () => {
        setVisibility(false)
    };

    const submitNewTopic = () => {
        const alphanumeric = /^[a-zA-Z0-9\-\s\_]+$/;

        if (topicName === '' || topicName === "") {
            message.warning("Topic can not be empty")
            return null
        }

        if (topicName.length > 50) {
            message.warning("Topic name can not be more than 50 characters");
            return null
        }

        if (!alphanumeric.test(topicName)) {
            message.warning("Topic name can only have Numbers, Letters, Spaces, Underscores, and Dashes")
            return null
        }

        setLoading(true);
        return peakAxiosConfig.put(`/api/v1/users/${user.id}/topics/${topic.id}`, {
            "topic": {
                color: "green",
                name: topicName,
                privacy_level: "private",
            }
        }).then((res) => {
            const newTopic: PeakTopic = res.data.topic
            const newHierarchy: PeakTopicNode[] = res.data.hierarchy
            dispatch(updateTopic(newTopic));
            dispatch(setUserHierarchy(newHierarchy));
            message.success("Updated the topic")
        }).catch(() => {
            message.error("Failed to update topic")
        }).finally(() => {
            setVisibility(false)
            setLoading(false)
        })
    };

    return (
        <div className={"edit-topic-modal-container"}>
            <EditOutlined className={cn("edit-topic-icon", hovered ? "visible" : "")} onClick={() => setVisibility(true)}/>
            <Modal
                title="Update a Topic"
                visible={visible}
                onOk={submitNewTopic}
                confirmLoading={isLoading}
                onCancel={handleCancel}>
                <Input
                    autoFocus={true}
                    placeholder="Ex. Startups"
                    onPressEnter={submitNewTopic}
                    value={topicName}
                    addonBefore={<CompassOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => {
                        setTopicName(e.target.value)
                    }}
                    suffix={
                        <Tooltip title="Topics are the high-level things you want to learn about. The topic will be an umbrella for all the pages related to that entity.">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
            </Modal>
        </div>
    )
};
