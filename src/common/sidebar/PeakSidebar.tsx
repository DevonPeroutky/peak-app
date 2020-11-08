import React, {useEffect, useState} from 'react'
import 'antd/dist/antd.css';
import "./peak-sidebar.scss";
import {Layout, Menu, Divider, message} from 'antd';
import { PeakLogo } from "../logo/PeakLogo";
import AddTopicModal from "../modals/add-topic/AddTopicModal";
import {Link, useHistory} from "react-router-dom";
import {PeakTopic, addPageToTopic, PeakPage} from "../../redux/topicSlice";
import {batch, connect, useDispatch} from "react-redux";
import {Peaker} from "../../redux/userSlice";
import {createPage, setEditing, PeakWikiPage} from "../../redux/wikiPageSlice";
import {capitalize_and_truncate} from "../../utils/strings";
import cn from "classnames"
import {
    PlusSquareOutlined,
} from '@ant-design/icons';
import {useCurrentPageId, useCurrentUser, useIsFullscreen, useTopics} from "../../utils/hooks";
import {backend_host_address, ELECTRON} from "../../constants/constants";
import {UpdateTopicModal} from "../modals/update-topic/UpdateTopicModal";
import {MenuOutlined, ReadOutlined} from "@ant-design/icons/lib";
import {DeleteTopicModal} from "../modals/delete-topic-modal/DeleteTopicModal";
import axios from 'axios';
import {ELEMENT_PARAGRAPH} from "@udecode/slate-plugins";
import {TITLE} from "../rich-text-editor/constants";
import {capitalize} from "lodash";
import config from "../../constants/environment-vars"
const { Sider } = Layout;


const PeakSidebar = (props: { }) => {
    const currentPageId = useCurrentPageId();
    const isFullscreen = useIsFullscreen()
    const isElectron = config.dist === ELECTRON
    const topics = useTopics()
    const user = useCurrentUser()

    return (
        <Sider className={cn("peak-sidebar", (isFullscreen || !isElectron) ? "fullscreen" : "not-fullscreen")} theme={"dark"}>
            <div className={cn("peak-logo-container")}>
                <PeakLogo className={"sidebar-logo"}/>
            </div>
            <h3 className={"overview-header"}>Overview</h3>
            <Menu mode="inline" selectedKeys={[`home/${currentPageId}`]} className={"overview-menu"}>
                <Menu.Item key="home/journal">
                    {/*<Link to={`${match.url}/journal`}>*/}
                    <Link to="/home/journal">
                        <ReadOutlined />Journal
                    </Link>
                </Menu.Item>
                {/*<Menu.Item key="home/timeline">*/}
                {/*    /!*<Link to={`${match.url}/timeline`}>*!/*/}
                {/*    <Link to="/home/timeline">*/}
                {/*        <MenuOutlined/>Timeline*/}
                {/*    </Link>*/}
                {/*</Menu.Item>*/}
            </Menu>
            <h3 className="topics-header">Topics</h3>
            <Menu mode="inline" selectedKeys={[currentPageId!]} className={"topic-menu"}>
                {topics.map(topic =>
                    // @ts-ignore
                    <Menu.ItemGroup key={topic.id.toLowerCase()} title={<TopicRow topic={topic} user={user}/>}>
                        {topic.pages.map(page =>
                            <Menu.Item key={page.id}>
                                <Link to={`/topic/${topic.id.toLowerCase()}/wiki/${page.id}`}>
                                    { (page.title && page.title.length > 0) ? capitalize_and_truncate(page.title) : "Untitled Page" }
                                </Link>
                            </Menu.Item>
                        )}
                    </Menu.ItemGroup>
                )}
            </Menu>
            <AddTopicModal/>
        </Sider>
    )
};

const TopicRow = (props: { topic: PeakTopic, user: Peaker }) => {
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

export default PeakSidebar;