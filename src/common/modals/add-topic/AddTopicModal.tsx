import React, { useState } from 'react';
import {Button, Modal, Input, Tooltip, message} from "antd";
import {useDispatch} from "react-redux";
import {addTopic, PeakTopic} from "../../../redux/slices/topicSlice"
import "./add-topic-modal.scss";
import peakAxiosClient from "../../../client/axiosConfig"
import {useCurrentUser} from "../../../utils/hooks";
import {setUserHierarchy} from "../../../redux/slices/user/userSlice";
import {CompassOutlined, InfoCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {PeakTopicNode} from "../../../redux/slices/user/types";

const AddTopicModal = (props: {}) => {
    const [visible, setVisibility] = useState(false);
    const [topicName, setTopicName] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useCurrentUser()
    const dispatch = useDispatch()

    const handleCancel = () => {
        setVisibility(false)
    };

    const submitNewTopic = () => {
        const alphanumeric = /^[a-zA-Z0-9\-\s\_]+$/;

        if (topicName === '' || topicName === "") {
            message.warning("Topic can not be empty")
            return
        }

        if (topicName.length > 250) {
            message.warning("Topic name can not be more than 250 characters");
            return
        }

        if (!alphanumeric.test(topicName)) {
            message.warning("Topic name can only have Numbers, Letters, Spaces, Underscores, and Dashes")
            return
        }

        setLoading(true);

        peakAxiosClient.post(`/api/v1/users/${user.id}/topics`, {
            "topic": {
                user_id: user.id,
                color: "green",
                name: topicName,
                privacy_level: "private"
            }
        }).then((res) => {
            message.info(`Created ${topicName} topic`)
            const newTopic: PeakTopic = res.data.topic
            const newHierarchy: PeakTopicNode[] = res.data.hierarchy
            dispatch(addTopic(newTopic));
            dispatch(setUserHierarchy(newHierarchy));
        }).catch(() => {
            message.error("Failed to create topic")
        }).finally(() => {
            setVisibility(false)
            setLoading(false)
            setTopicName('')
        })
    };

    return (
        <div className={"add-topic-modal-container"}>
            <Button ghost type="primary" shape="round" icon={<PlusOutlined/>} onClick={() => setVisibility(true)}>Add Topic</Button>
            <Modal
                title="Create a new Topic"
                visible={visible}
                onOk={submitNewTopic}
                confirmLoading={loading}
                onCancel={handleCancel}>
                <Input
                    autoFocus={true}
                    placeholder="Ex. Startups"
                    addonBefore={<CompassOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => {
                        setTopicName(e.target.value)
                    }}
                    value={topicName}
                    onPressEnter={submitNewTopic}
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

export default AddTopicModal;