import {addPageToTopic, PeakPage, PeakTopic} from "../../../../redux/slices/topicSlice";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {batch, useDispatch} from "react-redux";
import peakAxiosClient from "../../../../client/axiosConfig"
import {createPage} from "../../../../redux/slices/wikiPageSlice";
import {message} from "antd";
import {DeleteTopicModal} from "../../../modals/delete-topic-modal/DeleteTopicModal";
import {UpdateTopicModal} from "../../../modals/update-topic/UpdateTopicModal";
import cn from "classnames";
import {PlusSquareOutlined} from "@ant-design/icons/lib";
import "./topic-header-row.scss";
import {capitalize_and_truncate} from "../../../../utils/strings";
import {EMPTY_BODY_WITH_TITLE} from "../../../rich-text-editor/editors/constants";
import {Peaker} from "../../../../types";
import {PeakWikiPage} from "../../../../constants/wiki-types";
import { setEditing } from "../../../../redux/slices/activeEditor/activeEditorSlice";

export const TopicHeaderRow = (props: { topic: PeakTopic, user: Peaker, toggleExpanded: () => void }) => {
    const { topic, toggleExpanded } = props;
    let history = useHistory();
    const dispatch = useDispatch();
    const [hovered, setHovering] = useState(false);
    const [isloading, setLoading] = useState(false);
    const [clicked, setClicked] = useState(false)

    const pagesExist: boolean = topic.pages && topic.pages.length > 0

    const createPageUnderTopic = () => {
        peakAxiosClient.post(`/api/v1/users/${props.user.id}/pages`, {
            "page": {
                body: EMPTY_BODY_WITH_TITLE,
                topic_id: props.topic.id,
                title: "",
                privacy_level: "private",
            }
        }).then((res) => {
            const newPage: PeakWikiPage = { ...res.data.page as PeakWikiPage } ;

            batch(() => {
                dispatch(createPage({pageId: newPage.id, newPage: newPage}));
                dispatch(addPageToTopic({topicId: props.topic.id, page: newPage as PeakPage}));
                dispatch(setEditing({isEditing: true}));
            })
            history.push(`/topic/${topic.id}/wiki/${newPage.id}`);
        }).catch(() => {
            message.error("Failed to create page")
        }).finally(() => {
            setLoading(false);
        })
    };

    const handleClick = () => {
        if (pagesExist) {
            toggleExpanded()
        } else {
            setClicked(true)
            setTimeout(() => setClicked(false), 1500)
        }
    }

    return (
        <div className={cn("topic-group-title-row")}
             onMouseOver={() => setHovering(true)}
             onMouseLeave={() => setHovering(false)}
             onClick={() => handleClick()}
        >
            <span className={cn("topic-group-title", (clicked && !pagesExist) ? "animate__animated animate__shakeX" : "" )}>{capitalize_and_truncate(props.topic.name)}</span>
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