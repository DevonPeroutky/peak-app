import {addPageToTopic, PeakPage, PeakTopic} from "../../../../redux/topicSlice";
import {Peaker} from "../../../../redux/userSlice";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {batch, useDispatch} from "react-redux";
import {TITLE} from "../../../rich-text-editor/types";
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import axios from "axios";
import {backend_host_address} from "../../../../constants/constants";
import {createPage, PeakWikiPage, setEditing} from "../../../../redux/wikiPageSlice";
import {message} from "antd";
import {capitalize} from "lodash";
import {DeleteTopicModal} from "../../../modals/delete-topic-modal/DeleteTopicModal";
import {UpdateTopicModal} from "../../../modals/update-topic/UpdateTopicModal";
import cn from "classnames";
import {PlusSquareOutlined} from "@ant-design/icons/lib";
import "./topic-header-row.scss";

export const TopicHeaderRow = (props: { topic: PeakTopic, user: Peaker }) => {
    const [hovered, setHovering] = useState(false);
    const [isloading, setLoading] = useState(false);
    let history = useHistory();
    const dispatch = useDispatch();
    const { topic, user } = props;

    const createPageUnderTopic = () => {
        const empty_title = { type: TITLE, children: [{ text: ''}] }
        const empty_paragraph = { type: ELEMENT_PARAGRAPH, children: [{ text: ''}] }

        axios.post(`${backend_host_address}/api/v1/users/${props.user.id}/pages`, {
            "page": {
                body: [{ children: [empty_title, empty_paragraph] }],
                topic_id: props.topic.id,
                title: "",
                privacy_level: "private",
            }
        }).then((res) => {
            const newPage: PeakWikiPage = { ...res.data.page as PeakWikiPage } ;

            batch(() => {
                dispatch(createPage({pageId: newPage.id, newPage: newPage}));
                dispatch(addPageToTopic({topicId: props.topic.id, page: newPage as PeakPage}));
                dispatch(setEditing({pageId: newPage.id, isEditing: true}));
            })
            history.push(`/topic/${topic.id}/wiki/${newPage.id}`);
        }).catch(() => {
            message.error("Failed to create page")
        }).finally(() => {
            setLoading(false);
        })
    };

    return (
        <div className="topic-group-title-row" onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <span className={"topic-group-title"}>{capitalize(props.topic.name)}</span>
            <div className="icons-container">
                <DeleteTopicModal hovered={hovered} topicId={topic.id}/>
                <UpdateTopicModal hovered={hovered} topicId={topic.id}/>
                <PlusSquareOutlined
                    className={cn("add-page-icon", hovered ? "visible" : "")}
                    onClick = {createPageUnderTopic}
                />
            </div>
        </div>
    )
};